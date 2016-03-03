var express = require('express');
var app = express();
var mongoose = require('mongoose');

var methodOverride  = require('method-override');
var jsonParser = require('body-parser').json();

// Require a config file with API keys if testing locally
if(!process.env.USERNAME){
  var config = require('./config.js');
};

// Use heroku config vars or use own local copy of API keys
var mongooseUsername = process.env.USERNAME || config.username;
var mongoosePassword = process.env.PASSWORD || config.password;
// Connect to mongo lab account
mongoose.connect('mongodb://'+mongooseUsername+':'+mongoosePassword+'@ds011168.mlab.com:11168/lunchline')
console.log('L19 Connected to Mongoose');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);
app.use(methodOverride());

require('./routes/routes.js')(app, express);

module.exports = app;
