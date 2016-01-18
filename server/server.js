'use strict';

var Promise = require('bluebird');
Promise.longStackTraces();
// promisify fs -> this works global
Promise.promisifyAll(require('fs'));

// replace the native url parser by a much faster one
require('fast-url-parser').replace();

var db = require('./config/sequelize');
var express = require('express');
var config = require('./config/config');

console.error('Node', process.version);
var app = express();
require('./config/express')(app, config, db);

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

// Generate RSA keys for JWT
var fs = require('fs');
var keyFile = config.get('root') + '/data/id_rsa';
var pubKeyFile = keyFile + '.pub';
fs.lstatAsync(keyFile)
    .then(function () {
        return Promise.join(
            fs.readFileAsync(keyFile, 'utf8'),
            fs.readFileAsync(pubKeyFile, 'utf8')
        ).spread(function (privateKey, publicKey) {
            config.set('private_key', privateKey);
            config.set('public_key', publicKey);
        });
    })
    .catch(function () {
        console.log('Generating RSA key pair …');
        var keypair = require('keypair');
        var pair = keypair({bits: 1024});
        return Promise.join(
            fs.writeFileAsync(pubKeyFile, pair.public),
            fs.writeFileAsync(keyFile, pair.private)
        ).then(function () {
            console.log('RSA key pair generated');
            config.set('private_key', pair.private);
            config.set('public_key', pair.public);
        });
    });

// Event listening
var emitter = require('./emitter');
emitter.on('login_link_requested', function (email) {
    console.log('login_link_requested', email);
});
