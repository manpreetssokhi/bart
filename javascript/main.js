$(document).ready(function () {
    let timesVisited = localStorage.getItem('timesVisited');
    timesVisited = timesVisited === undefined ? 0 : Number(timesVisited);

    if (timesVisited > 0) {
        $("#visitNum").html(timesVisited);
        $("#visitAlert").show();
    }

    localStorage.setItem('timesVisited', timesVisited + 1)
    console.log('in main.js')
    console.log(timesVisited)

    displayRoute();
    console.log('just called displayRoute() from doc on ready');
});

let map;
var directionsService;
var directionsDisplay;

function initMap() {
    // directionsService = new google.maps.DirectionsService();
    // directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    var scu = new google.maps.LatLng(37.349646, -121.9411762);
    var mapRequest = {
        zoom: 8,
        center: scu
    }

    map = new google.maps.Map(document.getElementById('map'), mapRequest);
}

// WARM
// 37.5015843
// -121.93905

// Embarcadero
// 37.7929017
// -122.399199

function displayRoute() {
    var request = {
        origin: { lat: 37.5015843, lng: -121.93905 },
        destination: { lat: 37.7929017, lng: -122.399199 },
        travelMode: 'TRANSIT'
    };
    directionsService.set.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            window.alert('Errors with maps' + status);
        }
    });
}