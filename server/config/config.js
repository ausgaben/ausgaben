'use strict';

var nconf = require('nconf'),
    path = require('path');

nconf
    .file('local', {file: 'config.local.json'})   // read local overwrite
    .argv()                                       // Allow overwrites from command-line
    .env()                                        // Allow overwrites from env
    .file('default', {file: 'config.json'});      // read defaults

nconf.set('deployVersion', +new Date());
nconf.set('version', require('../../package.json').version);
nconf.set('app', require('../../package.json').name);
nconf.set('root', path.normalize(__dirname + '/../..'));
nconf.set('token_lifetime', 1800);

module.exports = nconf;
