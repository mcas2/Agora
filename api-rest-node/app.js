'use strict'
//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Execute express
var app = express();

//Load route files
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//re-write routes
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

module.exports = app;