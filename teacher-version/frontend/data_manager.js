
backend_url = "http://localhost:3011/";

var mymap = L.map('mapid').setView([40.748817, -73.982428], 16);

// Add base map layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

// Add all rooms on the map
var roomStyle = {
    "color": "#991111",
    "weight": 5,
    "opacity": 0.65
};
var roomsFeature = []
axios.get(`${backend_url}/safe-paths`)
    .then(function (response) {
        response.data.forEach(element => {
            console.log(element);
            var latlngs = [
                [element.start_lat, element.start_lng],
                [element.end_lat, element.end_lng]
            ];
            var polyline = L.polyline(latlngs, roomStyle).addTo(mymap);
            polyline.feature = { properties: { name: element.name } };
            polyline.on("click", onRoomClick);
            // roomsFeature.push(feature)
            // roomLayer = L.geoJSON(feature, { "style": roomStyle });
            // roomLayer.on("click", onRoomClick)
            // roomLayer.addTo(mymap)
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


function onDeviceClick(e) {

}
