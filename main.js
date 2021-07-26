var map = L.map('map').fitWorld();

L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);



var lastKnownLocation = undefined;
var myMarker = undefined;
var myRange = undefined;

var state = [];
var counter = 0;
var worldSeed = undefined;
var random = new Math.seedrandom('initial');
var monsters = []
var hitRange = 200


function onLocationFound(e) {
    if (lastKnownLocation != undefined && lastKnownLocation.lat === e.latlng.lat && lastKnownLocation.lng === e.latlng.lng) {
        return;
    }
    var radius = e.accuracy / 2;

    if (myMarker != undefined) {
        map.removeLayer(myMarker);
        map.removeLayer(myRange);
    }

    myMarker = L.marker(e.latlng).addTo(map);
        //.bindPopup("You are within " + radius + " meters from this point").openPopup();
    myRange = L.circle(e.latlng, hitRange).addTo(map);
    console.log(radius);
    lastKnownLocation = e.latlng;
    updateSeed(lastKnownLocation);

}

function updateSeed(latlng) {
    if (worldSeed === undefined || worldSeed != latlng) {
        worldSeed = lastKnownLocation.lat.toPrecision(4) + "-" + lastKnownLocation.lng.toPrecision(4)
        random = new Math.seedrandom(worldSeed);
        for (i = 0; i < 20; i++) {
            putRandomlyOnMap(lastKnownLocation);
        }
    }
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
setInterval(
    function() {
        var setViewAgain = lastKnownLocation === undefined;
        map.locate({setView: setViewAgain, maxZoom: 18});
        console.log("Locate")
    }
, 5000);


function calcCrow(lat1, lon1, lat2, lon2) { // km
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

function toRad(Value) {
  return Value * Math.PI / 180;
}


function putRandomlyOnMap(myLocation) {
    var latlng = {
        lat: myLocation.lat + ((random()-0.5)/100),
        lng: myLocation.lng + ((random()-0.5)/100)
    }
    var marker = L.marker(latlng, opacity = 0.5).addTo(map);
    marker.setOpacity(0.7);

    marker.on('click', function() {
        var distance = 1000 * calcCrow(latlng.lat, latlng.lng, myLocation.lat, myLocation.lng);
         if (distance < hitRange && Math.random() > 0.8 ) {
            map.removeLayer(marker);
         } else {
            marker.setOpacity(0.3);
            console.log("Pudło...");
         }
    })

    monsters.push(marker);
}



