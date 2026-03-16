// Organism name mapping
const organismNames = {
    'ZT': 'Zymoseptoria tritici',
    'PTT': 'Pyrenophora teres f. teres'
};

// Initialize map
const map = L.map('map').setView([58.73388394579544, 25.295285482571725], 8);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentMarkers = [];
let data = []; // Will be loaded from JSON file

// Load data from JSON file
fetch('data/fungicides.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        console.log('Data loaded successfully:', data.length, 'records');
        updateMap(); // Initial map update after data loads
    })
    .catch(error => {
        console.error('Error loading data:', error);
        alert('Viga andmete laadimisel. Palun värskenda lehte.');
    });

function getColor(value) {
    try {
        const val = parseFloat(value);
        
        if (val <= 0.5) {
            return "#27ae60";
        } else if (val > 0.5 && val < 5.0) {
            return "#f39c12";
        } else {
            return "#e74c3c";
        }
    } catch (e) {
        return "gray";
    }
}

function updateMap() {
    if (data.length === 0) {
        console.log('No data loaded yet');
        return;
    }
    
    const selectedYear = parseInt(document.getElementById('yearSlider').value);
    const selectedType = document.querySelector('input[name="valueType"]:checked').value;
    const selectedOrganism = document.querySelector('input[name="organismType"]:checked').value;
    const organismDisplay = organismNames[selectedOrganism];
    
    // Clear existing markers
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];
    
    // Filter data
    let filteredData = data.filter(row => 
        row.aasta === selectedYear && 
        row.organism === selectedOrganism &&
        row[selectedType] != null &&
        row.latitude != null &&
        row.longitude != null
    );
    
    // Group by location
    const locationGroups = {};
    filteredData.forEach(row => {
        const location = row.asukoht;
        if (!locationGroups[location]) {
            locationGroups[location] = {
                rows: [],
                maxValue: -Infinity,
                lat: row.latitude,
                lon: row.longitude
            };
        }
        locationGroups[location].rows.push(row);
        if (row[selectedType] > locationGroups[location].maxValue) {
            locationGroups[location].maxValue = row[selectedType];
        }
    });
    
    // Sort locations by max value so highest values appear on top
    const sortedLocations = Object.entries(locationGroups).sort(
        (a, b) => a[1].maxValue - b[1].maxValue
    );
    
    // Create markers
    sortedLocations.forEach(([location, group]) => {
        const maxValue = group.maxValue;
        const color = getColor(maxValue);
        
        // Get vald and maakond from first row in group
        const firstRow = group.rows[0];
        const vald = firstRow.vald || 'Teadmata';
        const maakond = firstRow.maakond || 'Teadmata';
        
        // Count values by category
        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;
        
        group.rows.forEach(row => {
            const val = row[selectedType];
            if (val <= 0.5) {
                greenCount++;
            } else if (val > 0.5 && val < 5.0) {
                yellowCount++;
            } else {
                redCount++;
            }
        });
        
        const marker = L.circleMarker([group.lat, group.lon], {
            radius: 8,
            color: "black",
            weight: 2,
            fillColor: color,
            fillOpacity: 0.9,
            fill: true,
            opacity: 1.0
        });
        
        // Create tooltip that shows on hover
        const tooltipContent = `
            <div style="font-family: Arial, sans-serif;">
                <p style="margin: 2px 0 5px 0;"><b>Asukoht:</b> ${vald}, ${maakond}</p>
                <!-- <p style="margin: 2px 0 5px 0; font-size: 11px; color: #7f8c8d;"><b>Koordinaadid:</b> ${group.lat.toFixed(6)}, ${group.lon.toFixed(6)}</p> -->
                <p style="margin: 2px 0;"><b>Organism:</b> ${organismDisplay}</p>
                <p style="margin: 2px 0;"><b>Maksimaalne EC50:</b> ${maxValue.toFixed(1)} mg/l</p>
                <p style="margin: 2px 0;"><b>Aasta:</b> ${selectedYear}</p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
                <p style="margin: 5px 0 3px 0; font-size: 12px; font-weight: 600;">Isolaatide jaotus:</p>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    ${greenCount > 0 ? `
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 14px; height: 14px; background-color: #27ae60; border: 2px solid #1e8449; border-radius: 50%;"></div>
                            <span style="font-size: 12px; font-weight: 500;">${greenCount}</span>
                        </div>
                    ` : ''}
                    ${yellowCount > 0 ? `
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 14px; height: 14px; background-color: #f39c12; border: 2px solid #d68910; border-radius: 50%;"></div>
                            <span style="font-size: 12px; font-weight: 500;">${yellowCount}</span>
                        </div>
                    ` : ''}
                    ${redCount > 0 ? `
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: 14px; height: 14px; background-color: #e74c3c; border: 2px solid #c0392b; border-radius: 50%;"></div>
                            <span style="font-size: 12px; font-weight: 500;">${redCount}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });
        marker.bindPopup(tooltipContent);
        marker.addTo(map);
        currentMarkers.push(marker);
    });
}

// Event listeners
document.getElementById('yearSlider').addEventListener('input', updateMap);
document.getElementById('radioGroup').addEventListener('change', updateMap);
document.getElementById('organismGroup').addEventListener('change', updateMap);
