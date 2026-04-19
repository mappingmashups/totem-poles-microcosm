var map = new maplibregl.Map({
        container: 'maplibre-map',
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [-125.5, 48.5],
        hash: true,
        zoom: 2,
      });

map.on('style.load', () => {
    map.setProjection({
        type: 'globe', // Set projection to globe
    });
});

function isTotemPoleArtwork(properties) {
    return String(properties.artwork_type || '').toLowerCase() === 'totem_pole';
}

function isOtherTotemPole(properties) {
    return ['sculpture_type', 'man_made', 'monument', 'culture'].some(
        (key) => String(properties[key] || '').toLowerCase() === 'totem_pole'
    );
}

function createFeatureCollection(features) {
    return {
        type: 'FeatureCollection',
        features,
    };
}

function formatProperties(properties) {
    let html = '';
    for (const [key, value] of Object.entries(properties)) {
        let displayValue = value;
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
            displayValue = `<a href="${value}" target="_blank">${value}</a>`;
        } else if (key === '@id') {
            const link = `https://www.openstreetmap.org/${value}`;
            displayValue = `<a href="${link}" target="_blank">${value}</a>`;
        }
        html += `<strong>${key}:</strong> ${displayValue}<br>`;
    }
    return html;
}

map.on('load', () => {
    const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true
    });

    fetch('./data.geojson')
        .then((response) => response.json())
        .then((data) => {
            map.addSource('totempoles-background-circles', {
                type: 'geojson',
                data: data,
            });

            map.addLayer({
                id: 'totempoles-background-rings',
                type: 'circle',
                source: 'totempoles-background-circles',
                paint: {
                    'circle-color': '#cccccc',
                    'circle-stroke-color': 'black',
                    'circle-stroke-width': 1,
                    'circle-radius': 4,
                },
            });

            map.addLayer({
                id: 'totempoles-background-fill',
                type: 'circle',
                source: 'totempoles-background-circles',
                paint: {
                    'circle-color': '#cccccc',
                    'circle-radius': 4,
                },
            });


            const group1 = [];
            const group2 = [];
            const group3 = [];

            (data.features || []).forEach((feature) => {
                const properties = feature.properties || {};

                if (isTotemPoleArtwork(properties)) {
                    group1.push(feature);
                } else if (isOtherTotemPole(properties)) {
                    group2.push(feature);
                } else {
                    group3.push(feature);
                }
            });

            map.addSource('totempoles-group-3', {
                type: 'geojson',
                data: createFeatureCollection(group3),
            });

            map.addSource('totempoles-group-2', {
                type: 'geojson',
                data: createFeatureCollection(group2),
            });

            map.addSource('totempoles-group-1', {
                type: 'geojson',
                data: createFeatureCollection(group1),
            });

            map.addLayer({
                id: 'totempoles-group-3',
                type: 'circle',
                source: 'totempoles-group-3',
                paint: {
                    'circle-color': '#eeeeee',
                    'circle-radius': 4,
                    //'circle-opacity': 0.3,
                },
            });

            map.addLayer({
                id: 'totempoles-group-2',
                type: 'circle',
                source: 'totempoles-group-2',
                paint: {
                    'circle-color': '#ecbc75',
                    'circle-radius': 4,
                    //'circle-opacity': 0.3,
                },
            });

            map.addLayer({
                id: 'totempoles-group-1',
                type: 'circle',
                source: 'totempoles-group-1',
                paint: {
                    'circle-color': '#2ecc71',
                    'circle-radius': 4,
                    //'circle-opacity': 0.3,
                },
            });

            map.addLayer({
                id: 'totempoles-group-3-hit',
                type: 'circle',
                source: 'totempoles-group-3',
                paint: {
                    'circle-color': '#000000',
                    'circle-radius': 10,
                    'circle-opacity': 0,
                },
            });

            map.addLayer({
                id: 'totempoles-group-2-hit',
                type: 'circle',
                source: 'totempoles-group-2',
                paint: {
                    'circle-color': '#000000',
                    'circle-radius': 10,
                    'circle-opacity': 0,
                },
            });

            map.addLayer({
                id: 'totempoles-group-1-hit',
                type: 'circle',
                source: 'totempoles-group-1',
                paint: {
                    'circle-color': '#000000',
                    'circle-radius': 10,
                    'circle-opacity': 0,
                },
            });

            ['totempoles-group-3-hit', 'totempoles-group-2-hit', 'totempoles-group-1-hit'].forEach(layerId => {
                map.on('mouseenter', layerId, (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    const feature = e.features[0];
                    const properties = feature.properties;
                    const html = formatProperties(properties);
                    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
                });
                map.on('mouseleave', layerId, (e) => {
                    map.getCanvas().style.cursor = '';
                });
            });
        })
        .catch((error) => {
            console.error('Failed to load GeoJSON:', error);
        });
});

map.addControl(new maplibregl.NavigationControl());
