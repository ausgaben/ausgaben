'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var config = require('./config');

console.log('Initializing Sequelize');
var sequelize = new Sequelize(config.postgresName, config.postgresUser, config.postgresPassword, {
    dialect: 'postgres',
    protocol: 'postgres',
    port: config.postgresPort,
    host: config.postgresHost,
    native: true,
    logging: false
});

// use long stacktraces for debugging
sequelize.Promise.longStackTraces();

// loop through all files in models directory and import the models
fs.readdirSync(config.modelsDir).forEach(function (file) {
    console.log('Import model ' + file);
    sequelize.import(path.join(config.modelsDir, file));
});

// invoke associations on each of the models
Object.keys(sequelize.models).forEach(function (modelName) {
    if (sequelize.models[modelName].options.hasOwnProperty('associate')) {
        sequelize.models[modelName].options.associate(sequelize.models);
    }
});

module.exports = sequelize;
