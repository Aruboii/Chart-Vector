
"""Chart Vector — AAI eAIP updater.

Updates:
- charts.json
- aerodromes.json

Aerodrome information:
- Elevation
- Runways and runway characteristics
- Transition altitude
- ATC frequencies

IATA codes and coordinates are deliberately excluded.

Run:
    py update_aip.py

Dependencies:
    pip install requests beautifulsoup4
"""

import json
import re
import time

from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse

import requests
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parent

SCRIPT = ROOT / "script.js"
CHARTS_FILE = ROOT / "charts.json"
AERODROMES_FILE = ROOT / "aerodromes.json"

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; ChartsIndia/1.2)"
})


def now():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    if not path.exists():
        return {"airports": {}}

    try:
        data = json.loads(path.read_text(encoding="utf-8"))

        if isinstance(data, dict) and isinstance(
            data.get("airports"), dict
        ):
            return data

    except (ValueError, OSError) as exc:
        print(f"WARNING: Cannot read {path.name}: {exc}")

    return {"airports": {}}


def save_json(path, data):
    temporary = path.with_suffix(path.suffix + ".tmp")

    temporary.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    temporary.replace(path)


def read_airports():
    text = SCRIPT.read_text(encoding="utf-8")

    objects = re.findall(r"\{[^{}]*\}", text, re.S)

    result = {}

    for obj in objects:
        fields = {}

        for key in ("icao", "name", "sourceUrl"):
            match = re.search(
                r"\b" + key + r"""\s*:\s*(['"])(.*?)\1""",
                obj,
                re.S
            )

            if match:
                fields[key] = match.group(2)

        if all(
            key in fields
            for key in ("icao", "name", "sourceUrl")
        ):
            code = fields["icao"].upper()

            if re.fullmatch(r"[A-Z]{4}", code):
                result[code] = fields

    return result


def fetch(url):
    try:
        response = SESSION.get(url, timeout=30)
        response.raise_for_status()

        return BeautifulSoup(
            response.content,
            "html.parser"
        )

    except requests.RequestException as exc:
        print(f"  Fetch failed: {exc}")
        return None


def clean(value):
    return re.sub(
        r"\s+",
        " ",
        str(value).replace("\xa0", " ")
    ).strip()


def airport_name(soup, icao, fallback):
    text = soup.get_text(" ", strip=True)

    match = re.search(
        rf"\b{icao}\s*-\s*(.*?)\s+{icao}\s+AD\s+2\.2\b",
        text,
        re.I
    )

    if match:
        name = clean(match.group(1))

        if 3 < len(name) < 150:
            return name

    return fallback


def chart_index(source_url, icao):
    base = source_url.rsplit("/", 1)[0] + "/"

    return urljoin(
        base,
        quote(f"AD 2.1{icao}_BChart.html")
    )


def extract_charts(soup, index_url):
    found = []
    seen = set()

    for a in soup.find_all("a", href=True):
        url = urljoin(
            index_url,
            a["href"].strip()
        )

        if not urlparse(url).path.lower().endswith(".pdf"):
            continue

        if url in seen:
            continue

        seen.add(url)

        name = clean(a.get_text(" ", strip=True))

        if not name:
            name = Path(urlparse(url).path).name

        found.append({
            "name": name,
            "url": url,
            "sourcePage": index_url
        })

    return found


def section_rows(soup):
    """Collect AAI table rows with their AD section."""

    rows = []
    section = ""

    tags = [
        "h1", "h2", "h3",
        "h4", "h5", "h6",
        "p", "div", "tr"
    ]

    for node in soup.find_all(tags):

        if node.name == "tr":
            cells = node.find_all(
                ["th", "td"],
                recursive=False
            )

            if len(cells) >= 2:
                values = [
                    clean(c.get_text(" ", strip=True))
                    for c in cells
                ]

                if any(values):
                    rows.append((section, values))

            continue

        if node.name == "div" and node.find(
            ["table", "div", "p", "h1", "h2", "h3"]
        ):
            continue

        value = clean(
            node.get_text(" ", strip=True)
        )

        if len(value) > 180:
            continue

        match = re.search(
            r"\bAD\s*2\.(\d{1,2})\b",
            value,
            re.I
        )

        if match:
            section = "2." + match.group(1)

    return rows


def extract_aerodrome(soup, icao):
    """Extract aerodrome data from the AAI eAIP."""

    data = {
        "elevationFt": None,
        "runways": [],
        "transitionAltitudeFt": None,
        "frequencies": [],
        "runwayDetails": []
    }

    rows = section_rows(soup)

    # -----------------------------------------
    # AERODROME ELEVATION / TRANSITION ALTITUDE
    # -----------------------------------------

    for section, cells in rows:

        for i, cell in enumerate(cells[:-1]):
            label = clean(cell).lower()
            value = clean(" ".join(cells[i + 1:]))

            if len(label) > 160:
                continue

            if not value or len(value) > 500:
                continue

            if (
                data["elevationFt"] is None
                and "aerodrome elevation" in label
            ):
                match = re.search(
                    r"\b(\d{1,5}(?:\.\d+)?)\s*(?:FT|FEET)\b",
                    value,
                    re.I
                )

                if match:
                    data["elevationFt"] = float(
                        match.group(1)
                    )

            if (
                data["transitionAltitudeFt"] is None
                and "transition altitude" in label
            ):
                match = re.search(
                    r"\b(\d{3,5})\s*(?:FT|FEET)\b",
                    value,
                    re.I
                )

                if match:
                    data["transitionAltitudeFt"] = int(
                        match.group(1)
                    )

    # -----------------------------------------
    # RUNWAYS — AD 2.12
    # -----------------------------------------
    #
    # AAI sometimes leaves runway dimensions
    # blank even when the runway is published.
    #
    # Example: VABB RWY 09 and RWY 27.
    #
    # Identify actual runway records using
    # their designator AND true bearing.
    #
    # Never require dimensions to exist.
    # -----------------------------------------

    runway_candidates = {}

    for section, cells in rows:

        if section != "2.12":
            continue

        if len(cells) < 3:
            continue

        values = [clean(c) for c in cells]

        designation = values[0].upper()

        if not re.fullmatch(
            r"(?:0[1-9]|[12]\d|3[0-6])[LCR]?",
            designation
        ):
            continue

        bearing = re.fullmatch(
            r"(\d{1,3}(?:\.\d+)?)\s*(?:DEG|°)",
            values[1],
            re.I
        )

        if not bearing:
            continue

        bearing_value = float(
            bearing.group(1)
        )

        if not 0 <= bearing_value <= 360:
            continue

        length = None
        width = None

        dimensions = re.search(
            r"(?<!\d)(\d{3,5})\s*"
            r"(?:x|×|X|\*)\s*"
            r"(\d{1,3})(?:\s*M)?\b",
            values[2],
            re.I
        )

        if dimensions:
            candidate_length = int(
                dimensions.group(1)
            )

            candidate_width = int(
                dimensions.group(2)
            )

            if (
                300 <= candidate_length <= 6000
                and 10 <= candidate_width <= 100
            ):
                length = candidate_length
                width = candidate_width

        surface = None

        for cell in values[3:5]:

            if re.search(
                r"\b(?:asphalt|bituminous|asph)\b",
                cell,
                re.I
            ):
                surface = "Asphalt"
                break

            if re.search(
                r"\b(?:concrete|cement|pcc)\b",
                cell,
                re.I
            ):
                surface = "Concrete"
                break

        runway_candidates[designation] = {
            "designation": designation,
            "lengthM": length,
            "widthM": width,
            "surface": surface
        }

    data["runways"] = list(
        runway_candidates.keys()
    )

    data["runwayDetails"] = list(
        runway_candidates.values()
    )

    # -----------------------------------------
    # ATC FREQUENCIES — AD 2.18
    # -----------------------------------------

    for section, cells in rows:

        if section != "2.18":
            continue

        if len(cells) < 2:
            continue

        service = clean(cells[0])

        if not re.search(
            r"\b(TWR|GND|APP|ATIS|DEL|ACC|RADAR|"
            r"TOWER|GROUND|APPROACH|CLEARANCE)\b",
            service,
            re.I
        ):
            continue

        frequencies = re.findall(
            r"\b1(?:1[89]|2\d|3[0-6])\.\d{1,3}\b",
            " ".join(cells[1:])
        )

        for frequency in frequencies:
            entry = (
                f"{service}: {frequency} MHz"
            )

            if entry not in data["frequencies"]:
                data["frequencies"].append(entry)

    return data


def merge_verified(previous, fresh):
    """Preserve previous valid fields when unavailable."""

    result = (
        dict(previous)
        if isinstance(previous, dict)
        else {}
    )

    # Remove obsolete fields from old JSON.
    result.pop("iata", None)
    result.pop("coordinates", None)

    for key, value in fresh.items():

        if value is not None and value != []:
            result[key] = value

        else:
            result.setdefault(key, value)

    return result


def main():

    if not SCRIPT.exists():
        print(
            "ERROR: script.js not found "
            "beside update_aip.py"
        )
        return

    airports = read_airports()

    if not airports:
        print(
            "ERROR: No airports found in script.js"
        )
        return

    chart_db = read_json(CHARTS_FILE)
    ad_db = read_json(AERODROMES_FILE)

    chart_db["source"] = "AAI eAIP India"
    ad_db["source"] = "AAI eAIP India"

    success_charts = 0
    success_ad = 0
    failed = []

    print(
        f"CHARTS INDIA | {len(airports)} airports"
    )

    # Remove unwanted fields from ALL existing
    # airport records, including failed updates.

    for record in ad_db["airports"].values():

        if isinstance(record, dict):
            record.pop("iata", None)
            record.pop("coordinates", None)

    for index, (icao, airport) in enumerate(
        airports.items(),
        1
    ):

        print(
            f"[{index}/{len(airports)}] {icao}"
        )

        source_url = airport["sourceUrl"]

        info = fetch(source_url)

        if info is None:
            failed.append(icao)
            time.sleep(1)
            continue

        extracted = extract_aerodrome(
            info,
            icao
        )

        previous = ad_db["airports"].get(
            icao,
            {}
        )

        updated = merge_verified(
            previous,
            extracted
        )

        # -------------------------------------
        # RUNWAY VALIDATION
        # -------------------------------------

        old_runways = set(
            previous.get("runways") or []
        )

        new_runways = set(
            extracted["runways"]
        )

        if extracted["runwayDetails"]:

            if (
                not old_runways
                or old_runways <= new_runways
            ):
                updated["runways"] = (
                    extracted["runways"]
                )

                updated["runwayDetails"] = (
                    extracted["runwayDetails"]
                )

            else:
                missing = sorted(
                    old_runways - new_runways
                )

                print(
                    "  REVIEW: runway extraction "
                    f"lost {missing}"
                )

        if (
            len(new_runways) % 2
            or not new_runways
        ):
            print(
                "  REVIEW: incomplete runway set: "
                f"{sorted(new_runways)}"
            )

        updated["sourceUrl"] = source_url
        updated["lastUpdated"] = now()

        ad_db["airports"][icao] = updated

        success_ad += 1

        # -------------------------------------
        # CHART EXTRACTION
        # -------------------------------------

        index_url = chart_index(
            source_url,
            icao
        )

        chart_soup = fetch(index_url)

        if chart_soup is not None:

            chart_list = extract_charts(
                chart_soup,
                index_url
            )

            if chart_list:

                chart_db["airports"][icao] = {
                    "icao": icao,
                    "name": airport_name(
                        info,
                        icao,
                        airport["name"]
                    ),
                    "sourceUrl": source_url,
                    "chartIndexUrl": index_url,
                    "charts": chart_list,
                    "lastUpdated": now()
                }

                success_charts += 1

                print(
                    f"  Charts: {len(chart_list)}"
                )

            else:
                print(
                    "  No chart PDFs; "
                    "retaining previous charts"
                )

                failed.append(icao)

        else:
            failed.append(icao)

        # -------------------------------------
        # UPDATE LOG
        # -------------------------------------

        print(
            "  AD fields:",
            ", ".join(
                f"{key}={value}"
                for key, value in extracted.items()
                if value is not None
                and value != []
            ) or "none confidently extracted"
        )

        time.sleep(1)

    # -----------------------------------------
    # SAVE DATABASES
    # -----------------------------------------

    if success_ad:
        ad_db["lastRun"] = now()

        ad_db["lastRunSuccessful"] = (
            success_ad
        )

    # Always save to remove obsolete fields,
    # including when some pages fail.

    save_json(
        AERODROMES_FILE,
        ad_db
    )

    if success_charts:

        chart_db["lastRun"] = now()

        chart_db["lastRunSuccessful"] = (
            success_charts
        )

        chart_db["lastRunFailed"] = sorted(
            set(failed)
        )

        save_json(
            CHARTS_FILE,
            chart_db
        )

    # -----------------------------------------
    # SUMMARY
    # -----------------------------------------

    print("\nUPDATE COMPLETE")

    print(
        f"AD pages processed: "
        f"{success_ad}/{len(airports)}"
    )

    print(
        f"Chart catalogues updated: "
        f"{success_charts}/{len(airports)}"
    )

    print(
        "Chart PDFs stored:",
        sum(
            len(a.get("charts", []))
            for a in chart_db["airports"].values()
        )
    )

    print(
        "Failed chart/page updates:",
        ", ".join(
            sorted(set(failed))
        ) or "none"
    )

    print(
        "Output: charts.json, aerodromes.json"
    )

    print(
        "NOTE: runway records require "
        "comparison with AD 2.12;"
    )

    print(
        "      no automatic parser can guarantee "
        "completeness across AAI layouts."
    )


if __name__ == "__main__":
    main()
