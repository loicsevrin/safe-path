
var mymap = L.map('mapid').setView([45.780, 4.871], 18);

// Add base map layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

// Add all rooms on the map
var roomStyle = {
    "color": "#003366",
    "weight": 5,
    "opacity": 0.65
};
var roomsFeature = []
axios.get('http://localhost:3000/rooms')
    .then(function (response) {
        response.data.forEach(element => {
            if (element.geom !== null) {
                var geometry = JSON.parse(element.geom)
                var feature = {
                    "type": "Feature",
                    "properties": {
                        "name": "room " + element.id,
                    },
                    "geometry": geometry
                };
                roomsFeature.push(feature)
                roomLayer = L.geoJSON(feature, { "style": roomStyle });
                roomLayer.on("click", onRoomClick)
                roomLayer.addTo(mymap)

            }
        });
        // var roomsLayer = L.geoJSON(roomsFeature, {"style": roomStyle});
        // roomsLayer.addTo(mymap);
        // roomsLayer.on("click", console.log("click"))
    })

function onRoomClick(e) {
    var roomName = e.propagatedFrom.feature.properties.name;
    console.log("You clicked the " + roomName + " at " + e.latlng.toString());
    console.log(e);
    console.log(e.propagatedFrom.feature.properties.name)
}

var devicesFeature = []
axios.get('http://localhost:3000/devices')
    .then(function (response) {
        response.data.forEach(element => {
            if (element.geom !== null) {
                var geometry = JSON.parse(element.geom)
                var feature = {
                    "type": "Feature",
                    "properties": {
                        "id": element.id,
                        "type": element.type,
                        "status": element.status
                    },
                    "geometry": geometry
                };
                devicesFeature.push(feature)
            }
        });
        console.log(devicesFeature)

        var thermometerHot = L.geoJSON(devicesFeature, {
            "pointToLayer": function (geoJsonPoint, latlng) {
                return L.marker(latlng, { "icon": L.icon({ iconUrl: 'icons/thermometer-hot.png', iconSize: [40, 40] }) }).bindPopup(`${geoJsonPoint.properties.status} °C`);
            },
            "filter": function (geoJsonFeature) {
                console.log("filter");
                console.log(geoJsonFeature);
                return (geoJsonFeature.properties.type == "thermometer"
                    && parseInt(geoJsonFeature.properties.status) > 25) ;
            }
        });
        thermometerHot.addTo(mymap);

        var thermometerCold = L.geoJSON(devicesFeature, {
            "pointToLayer": function (geoJsonPoint, latlng) {
                return L.marker(latlng, { "icon": L.icon({ iconUrl: 'icons/thermometer-cold.png', iconSize: [40, 40] }) }).bindPopup(`${geoJsonPoint.properties.status} °C`);
            },
            "filter": function (geoJsonFeature) {
                console.log("filter");
                console.log(geoJsonFeature);
                return (geoJsonFeature.properties.type == "thermometer"
                    && parseInt(geoJsonFeature.properties.status) < 20) ;
            }
        });
        thermometerCold.addTo(mymap);

        var thermometerNormal = L.geoJSON(devicesFeature, {
            "pointToLayer": function (geoJsonPoint, latlng) {
                return L.marker(latlng, { "icon": L.icon({ iconUrl: 'icons/thermometer.png', iconSize: [40, 40] }) }).bindPopup(`${geoJsonPoint.properties.status} °C`);
            },
            "filter": function (geoJsonFeature) {
                console.log("filter");
                console.log(geoJsonFeature);
                return (geoJsonFeature.properties.type == "thermometer"
                    && parseInt(geoJsonFeature.properties.status) <= 25
                    && parseInt(geoJsonFeature.properties.status) >= 20) ;
            }
        });
        thermometerNormal.addTo(mymap);

        var lampOff = L.geoJSON(devicesFeature, {
            "pointToLayer": function (geoJsonPoint, latlng) {
                return L.marker(latlng, { "icon": L.icon({ iconUrl: 'icons/lamp-off.png', iconSize: [40, 40] }) }).bindPopup(`${geoJsonPoint.properties.status}`);
            },
            "filter": function (geoJsonFeature) {
                console.log("filter");
                console.log(geoJsonFeature);
                return (geoJsonFeature.properties.type == "lamp"
                    && geoJsonFeature.properties.status == "off");
            }
        });
        lampOff.addTo(mymap);

        var lampOn = L.geoJSON(devicesFeature, {
            "pointToLayer": function (geoJsonPoint, latlng) {
                return L.marker(latlng, { "icon": L.icon({ iconUrl: 'icons/lamp-on.png', iconSize: [40, 40] }) }).bindPopup(`${geoJsonPoint.properties.status}`);
            },
            "filter": function (geoJsonFeature) {
                console.log("filter");
                console.log(geoJsonFeature);
                return (geoJsonFeature.properties.type == "lamp"
                    && geoJsonFeature.properties.status == "on");
            }
        });
        lampOn.addTo(mymap);


    })

function onDeviceClick(e) {

}
