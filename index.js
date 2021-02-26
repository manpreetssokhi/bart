const express = require('express');
const request = require('request');
const http = require('http');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bartAPIKey = "ZR2V-5S6P-9W4T-DWEI";

const PORT = process.env.PORT || 4200;

// declaring express app
app = express();

// enabling cors - part 5 same-origin policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// register view engine
app.set('view engine', 'ejs');
app.set('port', PORT);


// declare static directory
app.use("/styles", express.static(__dirname + "/styles"));

// for constants in the .env file
require('dotenv').config();

app.get('/', (req, res) => {
    // res.send('hello bobby');
    res.render('home');
    console.log('in home');
});

app.get('/arrivals', (req, res) => {
    // res.send('hello bobby');
    res.render('arrivals');
    console.log('in arrivals');
});

app.listen(PORT, function () {
    console.log('Listening on port ', PORT);
});