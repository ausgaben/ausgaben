'use strict';

var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    config = require('./config');

console.log('Initializing Sequelize');
var sequelize = new Sequelize(config.get('postgres').name, config.get('postgres').user, config.get('postgres').password, {
    dialect: 'postgres',
    protocol: 'postgres',
    port: config.get('postgres').port,
    host: config.get('postgres').host,
    native: true,
    logging: false
    // logging: console.log
});

// use long stacktraces for debugging
sequelize.Promise.longStackTraces();

// loop through all files in models directory and import the models
var modelsDir = path.normalize(__dirname + '/../models');
fs.readdirSync(modelsDir).forEach(function (file) {
    console.log('Import model ' + file);
    sequelize.import(path.join(modelsDir, file));
});

// invoke associations on each of the models
Object.keys(sequelize.models).forEach(function (modelName) {
    if (sequelize.models[modelName].options.hasOwnProperty('associate')) {
        sequelize.models[modelName].options.associate(sequelize.models);
    }
});

module.exports = sequelize;
