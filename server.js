const express = require('express');
const app = express();
const bodyParser = require('body-parser')
// Use the JavaScript Swagger definition
const dotenv = require('dotenv').config();
app.use('/', require('./src/routes/path'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = 5500;
app.listen(process.env.PORT || port);
console.log(`Web Server is listening at: ${process.env.PORT || port}`);