const express = require('express');
const path = require('path');
const request = require('request');
const http = require('http');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bartAPIKey = "ZR2V-5S6P-9W4T-DWEI";

const PORT = process.env.PORT || 4200;

// declaring express app
app = express();

// configure engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);

app.set('views', path.join(__dirname + "/views"));
app.use("/styles", express.static(__dirname + "/styles"));

app.use(express.static('public'));

// for constants in the .env file
require('dotenv').config();

// enabling cors - part 5 same-origin policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/home', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    res.render('home', context);
    console.log('in home');
});

app.get('/arrivals', (req, res) => {
    // res.send('hello bobby');
    let context = {};
    res.render('arrivals', context);
    console.log('in arrivals');
});

app.listen(PORT, function () {
    console.log('Listening on port ', PORT);
});