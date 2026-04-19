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

map.on('load', () => {
    // Add the US states source and a light outline layer
    map.addSource('totempoles', {
        type: 'geojson',
        data: './data.geojson'
    });

    map.addLayer({
        id: 'totempoles',
        type: 'circle',
        source: 'totempoles',
        paint: {
            'circle-color': '#ff0099',
            'circle-radius': 4,
            'circle-opacity': 0.2,
        }
    });
});

map.addControl(new maplibregl.NavigationControl());
