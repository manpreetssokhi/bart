const express = require('express');
const path = require('path');
const request = require('request');
const http = require('http');
const bodyParser = require('body-parser');
// const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const handlebars = require('express-handlebars');
const bartAPIKey = 'MW9S-E7SL-26DU-VV8V';

const PORT = process.env.PORT || 4200;

// declaring express app
app = express();

// engine setup
// app.engine('handlebars', handlebars.engine);
app.engine('handlebars', handlebars({extname: 'handlebars', defaultLayout: 'main', layoutsDir: path.join(__dirname + '/views/layouts/')}));
app.set('view engine', 'handlebars');
app.set('port', PORT);
app.set('views', path.join(__dirname + '/views'));
app.use("/styles", express.static(__dirname + '/styles'));

app.use(express.static('public'));

// for constants in the .env file
require('dotenv').config();

// enabling cors - part 5 same-origin policy
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// function for creating XML from JSON
function getJSON(uri, callabck) {
    http.get(uri, function(APIres) {
        console.log('URI: ' + uri);
        console.log('STATUS: ' + APIres.statusCode);
        let bodyChunks = [];
        APIres.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            let body = Buffer.concat(bodyChunks);
            body = JSON.parse(body);
            callabck(body);
        })
    });
}

app.get('/', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    res.render('stations', context);
    console.log('in home');
});

app.get('/stations', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    
    getJSON('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartAPIKey + '&json=y', function(body) {
        // res.send(body.root.stations.station);
        // console.log(body.root.stations.station);
        context = body.root.stations.station;
        console.log(context);
        // res.render('stations', {title: 'Stations List', context: context, condition: false});
        res.render('stations', {context});
    })

    console.log('in stations');
});

app.get('/station', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    let station = req.query.station;

    if (station !== undefined && station.length == 4) {
        getJSON('http://api.bart.gov/api/stn.aspx?cmd=stninfo&key=' + bartAPIKey + '&orig=' + station + '&json=y', function(body) {
            context = body.root.stations.station;
            console.log(context);
            res.render('station', context);
        })
    } else {
        res.status(400).send({
            message: 'no station was sent by BART API'
        });
    }

    res.render('station', context);
    console.log('in station');
});

app.get('/trips', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    let source = req.query.source;
    let destination = req.query.destination;

    if (source !== undefined && destination !== undefined) {
        getJSON('http://api.bart.gov/api/sched.aspx?cmd=depart&key=' + bartAPIKey + '&orig=' + source + '&dest=' + destination + '&date=now&b=0&a=4&l=1&json=y', function(body) {
            context = body.root.stations.station;
            console.log(context);
            res.render('trips');
        })
    } else {
        res.status(400).send({
            message: 'no station was sent by BART API'
        });
    }
    res.render('trips', context);
    console.log('in trips');
});

app.listen(PORT, function () {
    console.log('Listening on port ', PORT);
});