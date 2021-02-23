const express = require('express');

// express app
app = express();

// register view engine
app.set('view engine', 'ejs');

// for constants in the .env file
require('dotenv').config();

app.get('/', (req, res) => {
    // res.send('hello bobby');
    res.render('index');
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Listening on port ', PORT);
});