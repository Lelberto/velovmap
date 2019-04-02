const defaultOptions = {
    position: [45.757407, 4.832341] // Centre de Lyon
}
let map;
let positionMarker;
const stationsMarkerGroup = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        var digits = `${cluster.getChildCount()}`.length;
        return L.divIcon({ 
            html: cluster.getChildCount(), 
            className: `station-cluster digits-${digits}`,
            iconSize: null 
        });
    }
});
const interestsMarkergroup = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        var digits = `${cluster.getChildCount()}`.length;
        return L.divIcon({ 
            html: cluster.getChildCount(), 
            className: `interest-cluster digits-${digits}`,
            iconSize: null 
        });
    }
});



/**
 * Crée la map.
 * 
 * @param data Données de la map
 * @param options Options de la map
 */
function createMap(data, options = defaultOptions) {
    map = L.map('map').setView(options.position, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(map);

    createPositionMarker();
    createDistrictsPolygons(data.districts);

    createStationsMarkers(data.stations);
    createInterestsMarkers(data.interests);
}



/**
 * Crée le markeur de la position de l'utilisateur.
 */
function createPositionMarker() {
    if (navigator.geolocation) {
        positionMarker = L.marker([0, 0]).addTo(map);
        positionMarker.bindPopup('<b>Vous êtes ici</b>');

        // Mise à jour de la position
        setInterval(() => {
            getGeolocation().then((position) => {
                positionMarker.setLatLng(new L.LatLng(position.coords.latitude, position.coords.longitude));
                clientSocket.emit('around', [position.coords.longitude, position.coords.latitude]);
            }).catch(console.error);
        }, 10000);

        // Initialisation de la position
        getGeolocation().then((position) => {
            positionMarker.setLatLng(new L.LatLng(position.coords.latitude, position.coords.longitude));
            clientSocket.emit('around', [position.coords.longitude, position.coords.latitude]);
        }).catch(console.error);
    }
}



/**
 * Met à jour le contenu du markeur de position.
 * 
 * @param stations Stations Vélo'v à ajouter dans le contenu du markeur de position
 */
function updatePositionMarker(stations) {
    let text = '';
    for (const station of stations) {
        text += `<br /><b>${station.properties.name}</b><br />À ${getDistance([positionMarker.getLatLng().lat, positionMarker.getLatLng().lng], [station.properties.lat, station.properties.lng])} mètres - Vélos disponibles : ${station.properties.available_bikes}<br />`;
    }
    positionMarker.bindPopup(`<b>Vous êtes ici</b><br /> ${text}`);
}



/**
 * Crée les markeurs des stations Vélo'v.
 * 
 * @param stations Stations Vélo'v
 */
function createStationsMarkers(stations) {
    stationsMarkerGroup.clearLayers();

    for (const station of stations) {
        const icon = L.icon({
            iconUrl: 'static/img/velov-icon.png',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [-3, -50]
        });
        const marker = L.marker([station.properties.lat, station.properties.lng], { icon });
        marker.bindPopup(`<b>${station.properties.name}</b><br />Vélos disponibles : ${station.properties.available_bikes}`);
        stationsMarkerGroup.addLayer(marker);
    }
    map.addLayer(stationsMarkerGroup);
}



/**
 * Crée les polygons des quartiers de Lyon.
 * 
 * @param districts Quartiers de Lyon
 */
function createDistrictsPolygons(districts) {
    for (const district of districts) {
        const polygon = L.polygon(reverseCoords(district.geometry.coordinates), {
            weight: 1,
            color: '#000000',
            fillColor: '#45b9ff',
            opacity: 0.8
        }).addTo(map);
        polygon.bindPopup(`<b>${district.properties.nom}</b>`);
    }
}



/**
 * Crée les markeurs des points d'intérêt.
 * 
 * @param interests Points d'intérêt
 */
function createInterestsMarkers(interests) {
    interestsMarkergroup.clearLayers();

    for (const interest of interests) {
        const icon = L.icon({
            iconUrl: 'static/img/interest-icon.png',
            iconSize: [40, 40],
            iconAnchor: [35, 40],
            popupAnchor: [-15, -40]
        });
        const marker = L.marker([interest.geometry.coordinates[1], interest.geometry.coordinates[0]], { icon });
        const website = interest.properties.siteweb ? `<br /><a href="${interest.properties.siteweb}" target="_blank">Accéder au site web</a>` : '';
        const email = interest.properties.email ? `<br />Adresse mail : ${interest.properties.email}` : '';
        const tel = interest.properties.telephone ? `<br />Téléphone : ${interest.properties.telephone}` : '';
        marker.bindPopup(`<b>${interest.properties.nom}</b>${website}${email}${tel}`);
        interestsMarkergroup.addLayer(marker);
    }
    map.addLayer(interestsMarkergroup);
}



/**
 * Inverse les coordonnées.
 * 
 * Les coordonnées inversées permettent de rendre compatible le GeoJSON en polygon.
 * 
 * @param coords Coordonnées à inverser
 */
function reverseCoords(coords) {
    for (const coord of coords) {
        for (const part in coord) {
            coord[part] = coord[part].reverse();
        }
    }
    return coords;
}



/**
 * Retourne la géolocalisation de l'utilisateur.
 * 
 * @returns Géolocalisation de l'utilisateur (Promise)
 */
function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            }, (err) => {
                reject(err);
            });
        } else {
            reject(new Error('Votre naviguateur ne support pas les données de localisation'));
        }
    });
}



/**
 * Retourne la distance entre deux positions.
 * 
 * @param position1 Position n°1
 * @param position2 Position n°2
 * @returns Distance entre les deux positions (en mètres)
 */
function getDistance(position1, position2) {
    var earthRadius = 6371;
    var dLat = Math.toRadians(position2[0] - position1[0]);
    var dLon = Math.toRadians(position2[1] - position1[1]); 
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(position1[0])) * Math.cos(Math.toRadians(position2[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = Math.trunc((earthRadius * c) * 1000); // Conversion kilomètres -> mètres et retrait des décimales
    return d;
}