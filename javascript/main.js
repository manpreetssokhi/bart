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