'use strict';

var nconf = require('nconf'),
    path = require('path'),
    pjson = require('../../package.json');

nconf
    .file('local', {file: 'config.local.json'})   // read local overwrite
    .argv()                                       // Allow overwrites from command-line
    .env()                                        // Allow overwrites from env
    .file('default', {file: 'config.json'});      // read defaults

nconf.set('deployVersion', +new Date());
nconf.set('version', pjson.version);
nconf.set('app', pjson.name);
nconf.set('description', pjson.description);
nconf.set('root', path.normalize(__dirname + '/../..'));
nconf.set('token_lifetime', 1800);

module.exports = nconf;
