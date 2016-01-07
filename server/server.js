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

if (config.get('environment') === 'development') {
    app.set('showStackError', true);
    app.use(express.static(config.get('root') + '/build'));
    console.log('Serving static files for ' + config.get('root') + '/build');
}

app.listen(config.get('port'), config.get('host'));
console.log(config.get('app') + ' v' + config.get('version') + ' (Node ' + process.version + ') started');
console.log('--port ' + config.get('port'));
console.log('--host ' + config.get('host'));
console.log('--environment ' + config.get('environment'));

module.exports = app;
