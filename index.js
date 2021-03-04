const express = require('express');
const path = require('path');
const request = require('request');
const http = require('http');
const bodyParser = require('body-parser');
// const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const handlebars = require('express-handlebars');
const { stat } = require('fs');
const { response } = require('express');
const bartAPIKey = 'MW9S-E7SL-26DU-VV8V';

const PORT = process.env.PORT || 2400;

// declaring express app
app = express();

// engine setup
// app.engine('handlebars', handlebars.engine);
app.engine('handlebars', handlebars({ extname: 'handlebars', defaultLayout: 'index', layoutsDir: path.join(__dirname + '/views/layouts/') }));
app.set('view engine', 'handlebars');
app.set('port', PORT);
app.set('views', path.join(__dirname + '/views'));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/javascript", express.static(__dirname + '/javascript'));

app.use(express.static('public'));

// for constants in the .env file
require('dotenv').config();

// enabling cors - part 5 same-origin policy
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// function to clean up response
function cleanUpResponse(inputString) {
    return inputString.replace(/<\/?a[^>]*>/g, '');
}

// home which renders a simple home page
app.get('/', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    res.render('stations', context);
    console.log('in home');
});

// /stations endpoint will send the list of all stations to handlebars via context and will render the statsions.handlebars view
app.get('/stations', (req, res) => {
    // res.send('hello bobby');
    let context = {};

    request('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartAPIKey + '&json=y', function (err, response, body) {
        if (!err && response.statusCode < 400) {
            let contextStation = JSON.parse(body);
            context.stations = contextStation.root.stations.station;

            // console.log(context);
            console.log('/stations - all stations were sent to handlebars')
            res.render('stations', context);
        } else {
            res.status(400).send({
                message: 'no station was send by BART API'
            });
        }
    })

    console.log('/stations END');
});

app.get('/station', function (req, res, next) {
    let context = {};

    // station information
    request('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartAPIKey + '&json=y', function (err, response, body) {
        if (!err && response.statusCode < 400) {
            let contextStation = JSON.parse(body);
            context.stations = contextStation.root.stations.station;

            console.log('HERE');
            // console.log(req.params.stn);
            console.log(req.query.stn);

            if (req.query.stn) {
                // station access information 
                request('http://api.bart.gov/api/stn.aspx?cmd=stnaccess&orig=' + req.query.stn + '&key=' + bartAPIKey + '&json=y', function (err, response, body) {
                    if (!err && response.statusCode < 400) {
                        let accessStation = JSON.parse(body);
                        context.access = accessStation.root.stations.station;

                        context.access.entering.text = cleanUpResponse(context.access.entering['#cdata-section']);
                        context.access.exiting.text = cleanUpResponse(context.access.exiting['#cdata-section']);
                        context.access.parking.text = cleanUpResponse(context.access.parking['#cdata-section']);
                        context.access.lockers.text = cleanUpResponse(context.access.lockers['#cdata-section']);
                        context.access.bike_station_text.text = cleanUpResponse(context.access.bike_station_text['#cdata-section']);

                        context.parking = context.access['@parking_flag'] == '1';
                        context.bike = context.access['@bike_flag'] == '1' || context.access['@locker_flag'] == '1' || context.access['@bike_station_flag'] == '1';
                        context.bikeRacks = context.access['@bike_flag'] == '1';

                        res.render('station', context);
                        // console.log(context);
                        console.log('/station - station was requested');
                    } else {
                        res.status(400).send({
                            message: 'no station was sent by BART API HERE 1'
                        });
                        next(err);
                    }
                });
            } else {
                res.render('station', context);
                // console.log(context);
                console.log('/station - no station was requested');
            }
        } else {
            res.status(400).send({
                message: 'no station was sent by BART API HERE 2'
            });
            next(err);
        }
    });
    console.log('/station END');
});

app.get('/trips', function (req, res, next) {
    // res.send('hello bobby');
    let context = {};
    let source = req.query.source;
    let destination = req.query.destination;

    request('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartAPIKey + '&json=y', function (err, response, body) {
        if (!err && response.statusCode < 400) {
            let contextStation = JSON.parse(body);
            context.stations = contextStation.root.stations.station;

            console.log('HERE');
            console.log(req.query.source);
            console.log(req.query.destination);

            if (source !== undefined && destination !== undefined) {
                request('http://api.bart.gov/api/sched.aspx?cmd=depart&key=' + bartAPIKey + '&orig=' + source + '&dest=' + destination + '&date=now&b=0&a=4&l=1&json=y', function (err, response, body) {
                    if (!err && response.statusCode < 400) {
                        let contextTrip = JSON.parse(body);
                        context.tripResponse = contextTrip.root.schedule.request; // .root.schedule; // .stations.station;
                        // console.log(context.tripResponse.trip[0]['@fare']);
                        // console.log(context.tripResponse.trip[0].leg);
                        for (var iterator in context.stations) {
                            if (context.stations[iterator].abbr == source) {
                                sourceLatLngJSON = {
                                    sourceLat: context.stations[iterator].gtfs_latitude,
                                    sourceLng: context.stations[iterator].gtfs_longitude
                                };
                                // console.log(sourceLatLngJSON);
                            } else if (context.stations[iterator].abbr == destination) {
                                destinationLatLngJSON = {
                                    destinationLat: context.stations[iterator].gtfs_latitude,
                                    destinationLng: context.stations[iterator].gtfs_longitude   
                                }
                                // console.log(destinationLatLngJSON);
                            }
                        }
                        context.sourceLatLng = sourceLatLngJSON;
                        context.destinationLatLng = destinationLatLngJSON;
                        console.log(context);
                        res.render('trips', context);
                        console.log('/trips - source and destination were specified');
                    } else {
                        res.status(400).send({
                            message: 'no station was sent by BART API HERE 1'
                        });
                        next(err);
                    }
                });
            } else {
                // context = body.root.stations.station;
                console.log(context);
                res.render('trips', context);
                console.log('/trips - no source and destination were specified');
            }
        } else {
            res.status(400).send({
                message: 'no station was sent by BART API HERE 2'
            });
            next(err);
        }
    });
    console.log('/trips END');
});

app.listen(PORT, function () {
    console.log('Listening on port ', PORT);
});
