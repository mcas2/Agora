'use strict'
//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Execute express
var  app = express();

//Load route files
var user_routes = require('./routes/user');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//re-write routes
app.use('/api', user_routes);

module.exports = app;