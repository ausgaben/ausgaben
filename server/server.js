'use strict';

var bluebird = require('bluebird');
bluebird.longStackTraces();
// promisify fs -> this works global
bluebird.promisifyAll(require('fs'));

// replace the native url parser by a much faster one
require('fast-url-parser').replace();

var db = require('./config/sequelize');
var express = require('express');
var config = require('./config/config');

console.error('Node', process.version);
var app = express();
require('./config/express')(app, db);
app.listen(config.port, config.hostname);
exports = module.exports = app;
console.log('App started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');
