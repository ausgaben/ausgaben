'use strict';

var bluebird = require('bluebird'),
    fs = require('fs'),
    util = require('util'),
    deployFs = require('./lib/fs'),
    deploySass = require('./lib/sass');
bluebird.longStackTraces();
bluebird.promisifyAll(require('fs'));

var appPath = './app';

// Create web root
var webPath = './web';
deployFs.mkDir(webPath);

// Copy static files
deployFs.copyFiles(appPath, webPath, /\.html$/);

// Copy vendor JS
deployFs.mkDir(webPath + '/js');
deployFs.copyFiles('./node_modules/material-design-lite', webPath + '/js', /\.js$/);

// Render sass
deployFs.mkDir(webPath + '/css');
deploySass.render(appPath + '/sass/styles.scss', webPath + "/css/styles.min.css");
