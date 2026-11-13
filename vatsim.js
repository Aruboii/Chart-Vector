
/* CHART VECTOR - LIVE VATSIM TRAFFIC */

(() => {
    "use strict";

    const code = new URLSearchParams(location.search)
        .get("icao")?.toUpperCase() || "VOBL";

    const API = "https://data.vatsim.net/v3/vatsim-data.json";
    const REFRESH_MS = 30000;
    const NM_PER_KM = 1 / 1.852;

    const el = id => document.getElementById(id);

    let map;
    let aircraftLayer;
    let rangeCircle;
    let airportPosition = null;
    let lastData = null;
    let loading = false;
    let radarEnabled = false;

    const radiusSelect = el("vt-radius");

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c]));
    }

    function airportDistance(lat1, lon1, lat2, lon2) {
        const rad = Math.PI / 180;
        const dLat = (lat2 - lat1) * rad;
        const dLon = (lon2 - lon1) * rad;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * rad) *
            Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) ** 2;

        return 3440.065 * 2 *
            Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Read the airport coordinates from OurAirports CSV.
    // This is loaded once per browser session.

    
async function getAirportPosition() {
    const cacheKey = "charts-india-airport-" + code;

    try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);
    } catch {}

    // OurAirports airport database in JSON format
    const response = await fetch(
        "https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
    );

    if (!response.ok) {
        throw new Error("Airport database unavailable");
    }

    const airports = await response.json();
    const airport = airports[code];

    if (!airport) {
        throw new Error(`Coordinates not found for ${code}`);
    }

    const lat = Number(airport.lat);
    const lon = Number(airport.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error("Invalid airport coordinates");
    }

    const result = { lat, lon };

    try {
        sessionStorage.setItem(
            cacheKey,
            JSON.stringify(result)
        );
    } catch {}

    return result;
}


    function initializeMap() {
        if (!window.L) {
            throw new Error("Leaflet map library unavailable");
        }

        map = L.map("vatsim-map", {
            zoomControl: true,
            preferCanvas: true
        }).setView([
            airportPosition.lat,
            airportPosition.lon
        ], 9);

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 18,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        ).addTo(map);

        aircraftLayer = L.layerGroup().addTo(map);

        L.circleMarker(
            [airportPosition.lat, airportPosition.lon],
            {
                radius: 7,
                color: "#ffffff",
                weight: 2,
                fillColor: "#38bdf8",
                fillOpacity: 1
            }
        )
        .bindPopup(`<b>${escapeHTML(code)}</b><br>Airport reference`)
        .addTo(map);

        rangeCircle = L.circle(
            [airportPosition.lat, airportPosition.lon],
            {
                radius: Number(radiusSelect.value) * 1852,
                color: "#38bdf8",
                weight: 1,
                opacity: 0.6,
                fillColor: "#38bdf8",
                fillOpacity: 0.04,
                interactive: false
            }
        ).addTo(map);

        map.fitBounds(rangeCircle.getBounds());

        
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        map.invalidateSize({
            pan: false,
            animate: false
        });

        map.fitBounds(rangeCircle.getBounds(), {
            animate: false
        });
    });
});

    }

    function aircraftIcon(heading) {
        const direction = Number(heading) || 0;

        return L.divIcon({
            className: "vt-aircraft-icon",
            html: `
                <div style="transform:rotate(${direction}deg)">
                    <svg width="25" height="25"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2 L14.2 9 L21 13 L21 15
                               L13.5 13 L13.5 19
                               L16 21 L16 22
                               L12 20.5 L8 22 L8 21
                               L10.5 19 L10.5 13
                               L3 15 L3 13 L9.8 9 Z"
                            fill="#38bdf8"
                            stroke="#08121e"
                            stroke-width="0.8"/>
                    </svg>
                </div>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });
    }

    function getAircraftType(pilot) {
        return pilot.flight_plan?.aircraft_short ||
            pilot.flight_plan?.aircraft ||
            "Unknown";
    }

    function renderMap(pilots) {
        if (!map) return;

        aircraftLayer.clearLayers();

        const range = Number(radiusSelect.value);

        const nearby = pilots.filter(pilot => {
            if (
                !Number.isFinite(pilot.latitude) ||
                !Number.isFinite(pilot.longitude)
            ) return false;

            return airportDistance(
                airportPosition.lat,
                airportPosition.lon,
                pilot.latitude,
                pilot.longitude
            ) <= range;
        });

        for (const pilot of nearby) {
            const distance = airportDistance(
                airportPosition.lat,
                airportPosition.lon,
                pilot.latitude,
                pilot.longitude
            );

            const fp = pilot.flight_plan || {};

            const popup = `
                <div class="vt-popup">
                    <strong>${escapeHTML(pilot.callsign)}</strong>
                    <p>${escapeHTML(getAircraftType(pilot))}</p>
                    <p>${escapeHTML(fp.departure || "—")}
                       → ${escapeHTML(fp.arrival || "—")}</p>
                    <p>Altitude: ${escapeHTML(pilot.altitude)} ft</p>
                    <p>Groundspeed: ${escapeHTML(pilot.groundspeed)} kt</p>
                    <p>Heading: ${escapeHTML(pilot.heading)}°</p>
                    <p>Distance: ${distance.toFixed(1)} NM</p>
                </div>
            `;

            L.marker(
                [pilot.latitude, pilot.longitude],
                { icon: aircraftIcon(pilot.heading) }
            )
            .bindPopup(popup)
            .addTo(aircraftLayer);
        }

        el("vt-nearby").textContent = nearby.length;
        el("vt-map-subtitle").textContent =
            `${code} · ${range} NM radar range`;
    }

    function flightRow(pilot, direction) {
        const fp = pilot.flight_plan || {};

        const otherAirport = direction === "arrival"
            ? fp.departure
            : fp.arrival;

        const route = direction === "arrival"
            ? `${otherAirport || "—"} → ${code}`
            : `${code} → ${otherAirport || "—"}`;

        return `
            <div class="vt-flight-row">
                <div>
                    <strong>${escapeHTML(pilot.callsign)}</strong>
                    <span>${escapeHTML(route)}</span>
                </div>
                <div class="vt-flight-meta">
                    <strong>${escapeHTML(getAircraftType(pilot))}</strong>
                    <span>${escapeHTML(pilot.altitude)} ft</span>
                </div>
            </div>
        `;
    }

    function renderFlightList(pilots, direction) {
        const target = direction === "arrival"
            ? "vt-arrivals"
            : "vt-departures";

        const countTarget = direction === "arrival"
            ? "vt-arrivals-count"
            : "vt-departures-count";

        const labelTarget = direction === "arrival"
            ? "vt-arrivals-label"
            : "vt-departures-label";

        const matching = pilots.filter(pilot => {
            const fp = pilot.flight_plan;

            if (!fp) return false;

            return direction === "arrival"
                ? fp.arrival?.toUpperCase() === code
                : fp.departure?.toUpperCase() === code;
        });

        // Nearby flights first, then by callsign.
        matching.sort((a, b) => {
            const da = airportDistance(
                airportPosition.lat,
                airportPosition.lon,
                a.latitude,
                a.longitude
            );

            const db = airportDistance(
                airportPosition.lat,
                airportPosition.lon,
                b.latitude,
                b.longitude
            );

            return da - db ||
                a.callsign.localeCompare(b.callsign);
        });

        el(countTarget).textContent = matching.length;
        el(labelTarget).textContent = `(${matching.length})`;

        el(target).innerHTML = matching.length
            ? matching.map(p =>
                flightRow(p, direction)
              ).join("")
            : `<p class="vt-empty">No online flights filed
                ${direction === "arrival" ? "to" : "from"}
                ${escapeHTML(code)}.</p>`;
    }

    function renderATC(controllers, atis) {
        const online = controllers.filter(c =>
            c.callsign?.toUpperCase().startsWith(code + "_")
        );

        const onlineAtis = atis.filter(c =>
            c.callsign?.toUpperCase().startsWith(code + "_")
        );

        const combined = [...online, ...onlineAtis];

        el("vt-atc-count").textContent = combined.length;

        el("vt-atc").innerHTML = combined.length
            ? combined.map(c => `
                <div class="vt-atc-row">
                    <strong>${escapeHTML(c.callsign)}</strong>
                    <span>${escapeHTML(c.frequency)} MHz</span>
                </div>
              `).join("")
            : `<p class="vt-empty">
                No airport-specific ATC positions online.
               </p>`;
    }

    function renderAll(data) {
        lastData = data;

        const pilots = data.pilots || [];

        if (radarEnabled) {
            renderMap(pilots);
        }
        renderFlightList(pilots, "arrival");
        renderFlightList(pilots, "departure");
        renderATC(data.controllers || [], data.atis || []);

        const timestamp = data.general?.update_timestamp;

        el("vt-updated").textContent = timestamp
            ? `Feed updated ${new Date(timestamp)
                .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })}`
            : "Feed time unavailable";

        el("vatsim-status").textContent = "● LIVE";
        el("vatsim-status").classList.add("online");
    }

    async function refreshTraffic() {
        if (loading || !airportPosition) return;

        loading = true;

        try {
            const response = await fetch(API, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(`VATSIM HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data.pilots)) {
                throw new Error("Invalid VATSIM response");
            }

            renderAll(data);
        } catch (error) {
            console.error("VATSIM:", error);

            el("vatsim-status").textContent =
                "Feed unavailable";

            el("vatsim-status").classList.remove("online");
        } finally {
            loading = false;
        }
    }

    radiusSelect.addEventListener("change", () => {
        if (!airportPosition || !map) return;

        rangeCircle.setRadius(
            Number(radiusSelect.value) * 1852
        );

        map.fitBounds(rangeCircle.getBounds());

        if (lastData) renderMap(lastData.pilots || []);
    });

    
async function start() {
    try {
        airportPosition = await getAirportPosition();

        // Do not initialize the map on page load.
        // Traffic lists and ATC still work normally.
        await refreshTraffic();

        setInterval(() => {
            if (!document.hidden) refreshTraffic();
        }, REFRESH_MS);

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) refreshTraffic();
        });

    } catch (error) {
        console.error("VATSIM initialization:", error);

        el("vatsim-status").textContent =
            "Traffic unavailable";

        el("vt-map-subtitle").textContent =
            error.message;
    }
}


let leafletPromise = null;

function loadLeaflet() {
    if (window.L) return Promise.resolve();

    if (leafletPromise) return leafletPromise;

    leafletPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";

        script.onload = resolve;
        script.onerror = () =>
            reject(new Error("Could not load radar library"));

        document.head.appendChild(script);
    }).catch(error => {
        leafletPromise = null;
        throw error;
    });

    return leafletPromise;
}

const radarButton = el("vt-toggle-radar");
const radarState = el("vt-radar-state");
const radarContainer = el("vatsim-map");

radiusSelect.disabled = true;

radarButton.addEventListener("click", async () => {
    radarEnabled = !radarEnabled;

    radarContainer.hidden = !radarEnabled;
    radiusSelect.disabled = !radarEnabled;

    radarButton.textContent = radarEnabled
        ? "Hide Live Radar"
        : "Show Live Radar";

    radarButton.setAttribute(
        "aria-expanded",
        String(radarEnabled)
    );

    radarState.textContent = radarEnabled
        ? "Live radar active"
        : "Radar disabled to save resources";

    if (radarEnabled) {
        if (!map) {
    try {
        await loadLeaflet();
        if (!radarEnabled) return;
        initializeMap();
    } catch (error) {
        console.error(error);
        radarEnabled = false;
        radarContainer.hidden = true;
        radiusSelect.disabled = true;
        radarButton.textContent = "Show Live Radar";
        radarButton.setAttribute("aria-expanded", "false");
        radarState.textContent = "Radar failed to load";
        return;
    }
}

        
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        if (!radarEnabled || !map) return;

        map.invalidateSize({
            pan: false,
            animate: false
        });
    });
});


        if (lastData) {
            renderMap(lastData.pilots || []);
        }
    }
});

start();

})();
