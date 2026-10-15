/*
 * Fungitsiiditundlikkuse kaart
 *
 * Loeb andmed failist data/fungicides.json ja näitab iga põllu kohta tähist,
 * mille kujund ja värv vastavad valitud haiguse, toimeaine ja aasta suurimale
 * EC50 väärtusele. Gruppide piirid on allpool; legend failis index.html peab
 * nendega ühtima.
 */
(() => {
    'use strict';

    const DATA_URL = 'data/fungicides.json';
    const MAP_CENTER = [58.73, 25.3];
    const MAP_ZOOM = 8;

    // Tundlikkusgruppide piirid (EC50, mg/l)
    const SENSITIVE_MAX = 0.5;
    const INSENSITIVE_MIN = 5;

    // Järjekord on oluline: suurema taluvusega tähised joonistatakse peale
    const GROUPS = [
        { id: 'sensitive', label: 'Tundlik' },
        { id: 'reduced', label: 'Vähem tundlik' },
        { id: 'insensitive', label: 'Mittetundlik' },
    ];

    const MESSAGES = {
        loading: 'Andmete laadimine…',
        loadError: 'Andmete laadimine ebaõnnestus. Palun värskenda lehte.',
        mapError: 'Kaardi laadimine ebaõnnestus. Palun värskenda lehte.',
        noData: 'Valitud haiguse, toimeaine ja aasta kohta andmed puuduvad.',
    };

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const numberFormat = new Intl.NumberFormat('et-EE', { maximumSignificantDigits: 3 });

    const form = document.getElementById('mapControls');
    const yearSlider = document.getElementById('yearSlider');
    const yearValue = document.getElementById('yearValue');
    const yearMarks = document.getElementById('yearMarks');
    const statusBox = document.getElementById('mapStatus');

    if (typeof L === 'undefined') {
        setStatus(MESSAGES.mapError);
        return;
    }

    const map = L.map('map').setView(MAP_CENTER, MAP_ZOOM);

    // OSM-i kasutustingimused nõuavad kaardipaanide päringutelt Referer-päist
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        referrerPolicy: 'strict-origin-when-cross-origin',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    let records = [];

    loadData();

    async function loadData() {
        setStatus(MESSAGES.loading);
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new TypeError('Andmefail peab sisaldama kirjete massiivi.');
            }
            records = data.map(normalizeRecord).filter(Boolean);
        } catch (error) {
            setStatus(MESSAGES.loadError);
            console.error(`Faili ${DATA_URL} laadimine ebaõnnestus.`, error);
            return;
        }

        setupYearSlider();
        form.addEventListener('submit', (event) => event.preventDefault());
        form.addEventListener('change', updateMap);
        yearSlider.addEventListener('input', updateMap);
        updateMap();
    }

    // Kirje kontroll ja ühtlustamine; ilma aasta või koordinaatideta kirjed jäetakse välja
    function normalizeRecord(row) {
        if (!row || typeof row !== 'object') {
            return null;
        }
        const year = toNumber(row.aasta);
        const lat = toNumber(row.latitude);
        const lon = toNumber(row.longitude);
        if (year === null || lat === null || lon === null) {
            return null;
        }
        return {
            row,
            year,
            disease: row.organism,
            locationId: row.asukoht || `${lat},${lon}`,
            place: [row.vald, row.maakond].filter(Boolean).join(', ') || 'Asukoht teadmata',
            lat,
            lon,
        };
    }

    // Aastavalik tekib andmete põhjal
    function setupYearSlider() {
        const years = [...new Set(records.map((record) => record.year))].sort((a, b) => a - b);
        if (years.length === 0) {
            return;
        }
        const first = years[0];
        const last = years[years.length - 1];

        yearSlider.min = String(first);
        yearSlider.max = String(last);
        yearSlider.value = String(last);
        yearSlider.disabled = false;

        const marks = [];
        for (let year = first; year <= last; year += 1) {
            marks.push(createElement('span', null, String(year)));
        }
        yearMarks.replaceChildren(...marks);
    }

    function updateMap() {
        markerLayer.clearLayers();

        if (yearSlider.disabled) {
            setStatus(MESSAGES.noData);
            return;
        }

        const disease = getCheckedInput('disease');
        const fungicide = getCheckedInput('fungicide');
        const year = Number(yearSlider.value);
        yearValue.textContent = String(year);

        const locations = groupByLocation(disease.value, fungicide.value, year);
        setStatus(locations.length === 0 ? MESSAGES.noData : '');

        const selection = {
            disease: getLabelText(disease),
            latinName: disease.dataset.latin,
            fungicide: getLabelText(fungicide),
            year,
        };
        locations.forEach((location) => createMarker(location, selection).addTo(markerLayer));
    }

    // Kirjete koondamine põldude kaupa; põllu grupp määratakse suurima EC50 järgi
    function groupByLocation(disease, fungicide, year) {
        const locations = new Map();

        for (const record of records) {
            if (record.year !== year || record.disease !== disease) {
                continue;
            }
            const ec50 = parseEc50(record.row[fungicide]);
            if (ec50 === null) {
                continue;
            }

            let location = locations.get(record.locationId);
            if (!location) {
                location = {
                    place: record.place,
                    lat: record.lat,
                    lon: record.lon,
                    max: ec50,
                    total: 0,
                    counts: Object.fromEntries(GROUPS.map((group) => [group.id, 0])),
                };
                locations.set(record.locationId, location);
            }

            location.total += 1;
            location.counts[classify(ec50.value)] += 1;
            if (ec50.value > location.max.value) {
                location.max = ec50;
            }
        }

        return [...locations.values()].map((location) => ({
            ...location,
            group: classify(location.max.value),
        }));
    }

    function createMarker(location, selection) {
        const groupIndex = GROUPS.findIndex((group) => group.id === location.group);
        const marker = L.marker([location.lat, location.lon], {
            icon: L.divIcon({
                className: 'map-marker',
                html: createShape(location.group).outerHTML,
                iconSize: [20, 20],
                popupAnchor: [0, -10],
            }),
            keyboard: true,
            riseOnHover: true,
            zIndexOffset: groupIndex * 1000,
        });

        marker.bindTooltip(createElement('span', null, location.place), {
            direction: 'top',
            offset: [0, -10],
        });
        marker.bindPopup(() => createPopup(location, selection));
        marker.on('popupopen', () => marker.closeTooltip());

        // Ekraanilugeja jaoks: tähis on nupp, mille nimes on asukoht ja grupp
        marker.on('add', () => {
            const element = marker.getElement();
            element.setAttribute('role', 'button');
            element.setAttribute('aria-label', `${location.place}: ${GROUPS[groupIndex].label.toLowerCase()}`);
        });

        return marker;
    }

    // Hüpikakna sisu luuakse DOM-elementidena, et andmefaili tekst ei saaks käivituda HTML-ina
    function createPopup(location, selection) {
        const popup = createElement('div', 'popup');
        popup.append(createElement('p', 'popup__title', location.place));

        const disease = [selection.disease];
        if (selection.latinName) {
            disease.push(' (', createLatinName(selection.latinName), ')');
        }

        const details = createElement('dl', 'popup__details');
        addDetail(details, ['Haigus'], disease);
        addDetail(details, ['Toimeaine'], [selection.fungicide]);
        addDetail(details, ['Aasta'], [String(selection.year)]);
        addDetail(details, ['Maksimaalne EC', createElement('sub', null, '50')], [`${location.max.text} mg/l`]);
        addDetail(details, ['Testitud isolaate'], [String(location.total)]);
        popup.append(details);

        popup.append(createElement('p', 'popup__subtitle', 'Isolaatide jaotus'));
        const groups = createElement('ul', 'popup__groups');
        for (const group of GROUPS) {
            const count = location.counts[group.id];
            if (count > 0) {
                const item = createElement('li');
                item.append(createShape(group.id), `${group.label}: ${count}`);
                groups.append(item);
            }
        }
        popup.append(groups);

        return popup;
    }

    function addDetail(list, term, description) {
        const dt = createElement('dt');
        dt.append(...term);
        const dd = createElement('dd');
        dd.append(...description);
        list.append(dt, dd);
    }

    // Ladinakeelne nimi kursiivis; vormi tähis „f.“ jääb püstkirja
    function createLatinName(name) {
        const fragment = document.createDocumentFragment();
        name.split(' f. ').forEach((part, index) => {
            if (index > 0) {
                fragment.append(' f. ');
            }
            fragment.append(createElement('em', null, part));
        });
        return fragment;
    }

    function createShape(groupId) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', `shape shape--${groupId}`);
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', `#shape-${groupId}`);
        svg.append(use);
        return svg;
    }

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (text !== undefined) {
            element.textContent = text;
        }
        return element;
    }

    function getCheckedInput(name) {
        return form.querySelector(`input[name="${name}"]:checked`);
    }

    function getLabelText(input) {
        return input.closest('label').textContent.replace(/\s+/g, ' ').trim();
    }

    function setStatus(message) {
        statusBox.textContent = message;
    }

    function toNumber(value) {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : null;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const number = Number(value.trim().replace(',', '.'));
            return Number.isFinite(number) ? number : null;
        }
        return null;
    }

    // EC50 on arv või piirväärtus (nt „>10“ või „<0,01“), mida loetakse piiri väärtusena.
    // Muu tekst (nt „NA“) jäetakse välja, et see ei satuks ekslikult mõnda gruppi.
    function parseEc50(value) {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? { value, text: numberFormat.format(value) } : null;
        }
        if (typeof value !== 'string') {
            return null;
        }
        const match = value.trim().replace(',', '.').match(/^([<>])?\s*(\d+(?:\.\d+)?)$/);
        if (!match) {
            return null;
        }
        const number = Number(match[2]);
        const prefix = match[1] ? `${match[1]} ` : '';
        return { value: number, text: prefix + numberFormat.format(number) };
    }

    function classify(ec50) {
        if (ec50 <= SENSITIVE_MAX) {
            return 'sensitive';
        }
        if (ec50 < INSENSITIVE_MIN) {
            return 'reduced';
        }
        return 'insensitive';
    }
})();
