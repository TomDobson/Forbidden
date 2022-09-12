const express = require("express");
const jwt = require('jsonwebtoken')
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');

dotenv.config({ path: './.env'})

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(favicon(path.join(__dirname, './public/images/favicon.ico')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs');

const dbUrl = process.env.DB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl, {

        });
        console.log('MonoDB is connect');
    } catch (error) {
        console.log('Error connecting to Database');
        console.log(error); 
    }
}

connectDB();

/**const db = mysql.createConnection({
    host:       process.env.DATABASE_HOST, /**ip address of server*//**
    user:       process.env.DATABASE_USER,
    password:   process.env.DATABASE_PASSWORD,
    database:   process.env.DATABASE
});

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MYSQL CONNECTED...")
    }
})*/

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/checkout', require('./routes/checkout'));

app.listen(5001, () => {
    console.log('Server started on Port 5001');
})