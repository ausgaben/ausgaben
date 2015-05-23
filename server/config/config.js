'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
    port: process.env.PORT || 3000,
    modelsDir: rootPath + '/models'
};
