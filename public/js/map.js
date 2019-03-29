const defaultOptions = {
    position: [45.757407, 4.832341] // Centre de Lyon
}

function createMap(data, options = defaultOptions) {
    const stations = data.stations;
    const districts = data.districts;
    const map = L.map('map').setView(options.position, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(map);

    createPositionMarker(map);

    const stationsMarkerGroup = L.markerClusterGroup();
    for (const station of stations) {
        const icon = L.icon({
            iconUrl: 'static/img/velov-icon.png',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [-3, -76]
        });
        const marker = L.marker([station.properties.lat, station.properties.lng], { icon });
        marker.bindPopup(`<b>${station.properties.name}</b><br />Vélos disponibles : ${station.properties.available_bikes}`);
        stationsMarkerGroup.addLayer(marker);
    }
    map.addLayer(stationsMarkerGroup);

    for (const district of districts) {
        const polygon = L.polygon(reverseCoords(district.geometry.coordinates), {
            weight: 1,
            color: '#000000',
            fillColor: '#8E008E',
            opacity: 0.7
        }).addTo(map);
        polygon.bindPopup(`<b>${district.properties.nom}</b>`);
    }
}

function createPositionMarker(map) {
    if (navigator.geolocation) {
        const marker = L.marker([0, 0]).addTo(map);
        marker.bindPopup('Vous êtes ici');

        setInterval(() => {
            navigator.geolocation.getCurrentPosition((position) => {
                marker.setLatLng(new L.LatLng(position.coords.latitude, position.coords.longitude));
            });
        }, 10000);
    }
}

function reverseCoords(coords) {
    for (const coord of coords) {
        for (const part in coord) {
            coord[part] = coord[part].reverse();
        }
    }
    return coords;
}