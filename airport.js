
/*
  CHART VECTOR - AIRPORT DASHBOARD

  Charts: charts.json
  Aerodrome information: aerodromes.json
  Weather: VATSIM METAR

  For flight simulation and educational use only.
*/

const params = new URLSearchParams(window.location.search);

const icao = (params.get("icao") || "VOBL").toUpperCase();
const fallbackName = params.get("name") || icao;
const fallbackSource = params.get("source") || "";

const $ = id => document.getElementById(id);

let charts = [];
let activeCategory = "All";
let activeChartUrl = null;

/* ========================================
   HELPERS
======================================== */

function setText(id, value, fallback = "Not available") {
    const element = $(id);

    if (!element) return;

    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? String(value)
            : fallback;
}

function setLink(id, url) {
    const element = $(id);

    if (!element) return;

    if (!url || !/^https:\/\//i.test(url)) {
        element.hidden = true;
        return;
    }

    element.href = url;
    element.hidden = false;
}

function formatList(value) {
    if (Array.isArray(value)) {
        return value.length
            ? value.map(item =>
                typeof item === "string"
                    ? item
                    : JSON.stringify(item)
              ).join(", ")
            : null;
    }

    return value || null;
}

function formatFeet(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? `${number.toLocaleString("en-IN")} ft`
        : null;
}

/* ========================================
   INITIALIZATION
======================================== */

setText("airport-name", fallbackName);
setText("airport-code", `${icao} · India`);
setText("info-icao", icao);
setText("info-charts", "Loading...");

setLink("official-aip", fallbackSource);

/* ========================================
   ATC FREQUENCY FORMATTING
======================================== */

const SERVICE_NAMES = {
    APP: "Approach",
    TWR: "Tower",
    GND: "Ground",
    DEL: "Clearance",
    ATIS: "ATIS",
    ACC: "Area Control",
    RADAR: "Radar"
};

const SERVICE_ORDER = [
    "ATIS",
    "DEL",
    "GND",
    "TWR",
    "APP",
    "RADAR",
    "ACC"
];

function normaliseService(raw) {
    const value = String(raw || "").toUpperCase().trim();

    if (/\bATIS\b/.test(value)) return "ATIS";

    if (/\b(?:DEL|DELIVERY|CLEARANCE)\b/.test(value)) {
        return "DEL";
    }

    if (/\b(?:GND|GROUND)\b/.test(value)) return "GND";

    if (/\b(?:TWR|TOWER)\b/.test(value)) return "TWR";

    if (/\b(?:APP|APPROACH)\b/.test(value)) return "APP";

    if (/\bRADAR\b/.test(value)) return "RADAR";

    if (/\b(?:ACC|AREA CONTROL)\b/.test(value)) {
        return "ACC";
    }

    return value || "OTHER";
}

function renderFrequencies(value) {
    const container = $("op-frequencies");

    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(value) || !value.length) {
        container.textContent = "Not available";
        return;
    }

    const grouped = new Map();

    for (const entry of value) {
        if (typeof entry !== "string") continue;

        const separator = entry.indexOf(":");

        if (separator === -1) continue;

        const service = normaliseService(
            entry.slice(0, separator)
        );

        const frequencyText = entry.slice(separator + 1);

        const matches = frequencyText.match(
            /\b1(?:1[89]|2\d|3[0-6])\.\d{1,3}\b/g
        );

        if (!matches) continue;

        if (!grouped.has(service)) {
            grouped.set(service, new Set());
        }

        for (const match of matches) {
            const frequency = Number(match).toFixed(3);
            grouped.get(service).add(frequency);
        }
    }

    if (!grouped.size) {
        container.textContent = "Not available";
        return;
    }

    const grid = document.createElement("div");
    grid.className = "frequency-grid";

    const orderedServices = [...grouped.keys()].sort(
        (a, b) => {
            const aIndex = SERVICE_ORDER.indexOf(a);
            const bIndex = SERVICE_ORDER.indexOf(b);

            return (
                (aIndex === -1 ? 999 : aIndex) -
                (bIndex === -1 ? 999 : bIndex)
            );
        }
    );

    for (const service of orderedServices) {
        const card = document.createElement("div");
        card.className = "frequency-card";

        const label = document.createElement("span");
        label.className = "frequency-service";
        label.textContent =
            SERVICE_NAMES[service] || service;

        const numbers = document.createElement("strong");
        numbers.className = "frequency-values";

        numbers.textContent = [...grouped.get(service)]
            .sort((a, b) => Number(a) - Number(b))
            .join(" · ");

        card.append(label, numbers);
        grid.appendChild(card);
    }

    container.appendChild(grid);

    const note = document.createElement("p");
    note.className = "frequency-note";
    note.textContent = "All frequencies in MHz";

    container.appendChild(note);
}

/* ========================================
   AERODROME METADATA
======================================== */

async function loadAerodromeInfo() {
    try {
        const response = await fetch(
            "./aerodromes.json",
            { cache: "no-cache" }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const database = await response.json();
        const airport = database.airports?.[icao];

        if (!airport) return;

        setText(
            "info-elevation",
            formatFeet(airport.elevationFt)
        );

        setText(
            "info-transition",
            formatFeet(airport.transitionAltitudeFt)
        );

        setText(
            "op-runways",
            formatList(airport.runways)
        );

        renderFrequencies(airport.frequencies);

    } catch (error) {
        console.warn(
            "Aerodrome metadata unavailable:",
            error
        );
    }
}

/* ========================================
   CHART CATEGORIZATION
======================================== */

function getCategory(chart) {
    const name = chart.name.toUpperCase();

    if (name.includes("SID")) return "SID";
    if (name.includes("STAR")) return "STAR";

    if (
        name.includes("ILS") ||
        name.includes("LOC") ||
        name.includes("RNP") ||
        name.includes("VOR") ||
        name.includes("NDB") ||
        name.includes("IAC")
    ) {
        return "Approach";
    }

    if (
        name.includes("PDC") ||
        name.includes("TORA") ||
        name.includes("LDA") ||
        name.includes("TAXI") ||
        name.includes("PARKING")
    ) {
        return "Ground";
    }

    if (
        name.includes("AOCT") ||
        name.includes("OBSTACLE")
    ) {
        return "Obstacles";
    }

    if (
        name.includes("ADC") ||
        name.includes("AERODROME")
    ) {
        return "Aerodrome";
    }

    return "Other";
}

/* ========================================
   CATEGORY FILTERS
======================================== */

function renderCategories() {
    const container = $("category-list");

    if (!container) return;

    container.replaceChildren();

    const categories = [
        "All",
        ...new Set(charts.map(chart => chart.category))
    ];

    categories.forEach(category => {
        const button = document.createElement("button");

        button.type = "button";
        button.className =
            "category-button" +
            (activeCategory === category ? " active" : "");

        button.textContent = category;

        button.addEventListener("click", () => {
            activeCategory = category;
            renderCategories();
            renderCharts();
        });

        container.appendChild(button);
    });
}

/* ========================================
   PDF SELECTION
======================================== */

function selectChart(chart) {
    activeChartUrl = chart.url;

    setText("selected-chart", chart.name);

    const viewer = $("pdf-viewer");

    if (viewer) {
        viewer.src = chart.url;
    }

    setLink("open-pdf", chart.url);

    $("viewer-placeholder")?.classList.add("hidden");

    renderCharts();
}

/* ========================================
   CHART LIST
======================================== */

function renderCharts() {
    const container = $("chart-list");

    if (!container) return;

    container.replaceChildren();

    const query = ($("chart-search")?.value || "")
        .trim()
        .toLowerCase();

    const filtered = charts.filter(chart =>
        (
            activeCategory === "All" ||
            chart.category === activeCategory
        ) &&
        chart.name.toLowerCase().includes(query)
    );

    setText("chart-count", filtered.length);

    if (!filtered.length) {
        container.textContent = "No matching charts found.";
        return;
    }

    filtered.forEach(chart => {
        const button = document.createElement("button");

        button.type = "button";

        button.className =
            "chart-item" +
            (activeChartUrl === chart.url ? " active" : "");

        const title = document.createElement("span");
        title.textContent = chart.name;

        const category = document.createElement("small");
        category.textContent = chart.category;

        button.append(title, category);

        button.addEventListener("click", () => {
            selectChart(chart);
        });

        container.appendChild(button);
    });
}

/* ========================================
   OFFICIAL SOURCE FALLBACK
======================================== */

function showSourceLink(url) {
    if (!url || !/^https:\/\//i.test(url)) return;

    const container = $("chart-list");

    if (!container) return;

    const link = document.createElement("a");

    link.className = "source";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View Official AAI AIP →";

    container.appendChild(
        document.createElement("br")
    );

    container.appendChild(link);
}

/* ========================================
   LOAD CHART DATABASE
======================================== */

async function loadAirport() {
    try {
        const response = await fetch(
            "./charts.json",
            { cache: "no-cache" }
        );

        if (!response.ok) {
            throw new Error(
                `Database request failed: ${response.status}`
            );
        }

        const database = await response.json();
        const airport = database.airports?.[icao];

        if (!airport) {
            $("chart-list").textContent =
                `No verified chart catalogue stored for ${icao}.`;

            setText("chart-count", "0");
            setText("info-charts", "0");

            showSourceLink(fallbackSource);
            return;
        }

        setText(
            "airport-name",
            airport.name || fallbackName
        );

        setText(
            "airport-code",
            `${airport.icao || icao} · India`
        );

        setLink(
            "official-aip",
            airport.sourceUrl || fallbackSource
        );

        charts = (airport.charts || [])
            .filter(chart =>
                typeof chart.name === "string" &&
                typeof chart.url === "string" &&
                /^https:\/\//i.test(chart.url)
            )
            .map(chart => ({
                name: chart.name,
                url: chart.url,
                category: getCategory(chart)
            }));

        setText("info-charts", charts.length);

        if (!charts.length) {
            $("chart-list").textContent =
                "No chart PDF links available.";

            setText("chart-count", "0");

            showSourceLink(
                airport.chartIndexUrl ||
                airport.sourceUrl ||
                fallbackSource
            );

            return;
        }

        renderCategories();
        renderCharts();

        setText(
            "selected-chart",
            `${icao} - Select a chart`
        );

        console.log(
            `Charts India: ${charts.length} charts loaded for ${icao}`
        );

    } catch (error) {
        console.error("Chart database error:", error);

        $("chart-list").textContent =
            "Unable to load charts.json. " +
            "Check that the website is running through a web server.";

        setText("chart-count", "0");
        setText("info-charts", "Unavailable");

        showSourceLink(fallbackSource);
    }
}

/* ========================================
   METAR WEATHER
======================================== */

function resetWeather() {
    setText("wx-wind", "—");
    setText("wx-visibility", "—");
    setText("wx-temperature", "—");
    setText("wx-qnh", "—");

    setText(
        "metar-updated",
        "Observation time unavailable"
    );
}

function decodeMetar(raw) {
    resetWeather();

    const metar = raw.toUpperCase();

    // Wind
    const wind = metar.match(
        /\b(VRB|\d{3})(\d{2,3})(?:G(\d{2,3}))?(KT|MPS)\b/
    );

    if (wind) {
        const direction =
            wind[1] === "VRB" ? "VRB" : `${wind[1]}°`;

        const gust = wind[3]
            ? ` G${wind[3]}`
            : "";

        setText(
            "wx-wind",
            `${direction} ${wind[2]}${gust} ${wind[4]}`
        );
    }

    // Visibility
    const visibility = metar.match(
        /\b(\d{4})(?:NDV)?\b/
    );

    if (visibility) {
        const metres = Number(visibility[1]);

        if (metres >= 500 && metres <= 9999) {
            setText(
                "wx-visibility",
                metres === 9999
                    ? "10 km or more"
                    : `${metres} m`
            );
        }
    }

    // Temperature
    const temperature = metar.match(
        /\b(M?\d{2})\/(M?\d{2}|\/\/)\b/
    );

    if (temperature) {
        const temp = temperature[1].replace("M", "-");
        setText("wx-temperature", `${temp}°C`);
    }

    // QNH
    const qnh = metar.match(/\bQ(\d{4})\b/);

    if (qnh) {
        setText("wx-qnh", `${qnh[1]} hPa`);
    }

    // Observation time
    const observation = metar.match(
        /\b(\d{2})(\d{2})(\d{2})Z\b/
    );

    if (observation) {
        setText(
            "metar-updated",
            `Reported ${observation[1]} day, ` +
            `${observation[2]}:${observation[3]} UTC`
        );
    }
}

async function loadMetar() {
    const button = $("refresh-metar");
    const status = $("metar-status");

    if (!button || !status) return;

    button.disabled = true;
    status.className = "status-pill";
    status.textContent = "Loading";

    setText("metar-raw", "Retrieving latest METAR...");
    resetWeather();

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        10000
    );

    try {
        const url =
            `https://metar.vatsim.net/${encodeURIComponent(icao)}`;

        const response = await fetch(url, {
            cache: "no-store",
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const raw = (await response.text()).trim();

        if (
            !raw ||
            raw.length > 1000 ||
            !raw.toUpperCase().includes(icao) ||
            !/\b\d{6}Z\b/.test(raw)
        ) {
            throw new Error("Invalid or missing METAR");
        }

        setText("metar-raw", raw);

        status.className = "status-pill available";
        status.textContent = "Received";

        decodeMetar(raw);

    } catch (error) {
        console.warn("METAR unavailable:", error);

        setText(
            "metar-raw",
            "METAR currently unavailable. " +
            "Use the external weather source below."
        );

        status.className = "status-pill unavailable";
        status.textContent = "Unavailable";

        resetWeather();

    } finally {
        clearTimeout(timeout);
        button.disabled = false;
    }
}

/* ========================================
   EVENT LISTENERS
======================================== */

$("chart-search")?.addEventListener(
    "input",
    renderCharts
);

$("refresh-metar")?.addEventListener(
    "click",
    loadMetar
);

setLink(
    "external-metar",
    `https://aviationweather.gov/data/metar/?id=${encodeURIComponent(icao)}`
);

/* ========================================
   START
======================================== */

loadAirport();
loadAerodromeInfo();
loadMetar();
