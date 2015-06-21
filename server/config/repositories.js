'use strict';

var db = require('./sequelize');

var repositories = [];

Object.keys(db.models).forEach(function (modelName) {
    // Load repository
    if (db.models[modelName].options.hasOwnProperty('repository')) {
        repositories[modelName] = require('../repository/' + db.models[modelName].options.repository).Repository(db);
    }
});

module.exports = repositories;
