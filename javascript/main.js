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
});

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}