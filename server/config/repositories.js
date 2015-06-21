'use strict';

var db = require('./sequelize');

var repositories = [];

Object.keys(db.models).forEach(function (modelName) {
    // Load repository
    if (db.models[modelName].options.hasOwnProperty('repository')) {
        var repo = require('../repository/' + db.models[modelName].options.repository);
        repositories[modelName] = new repo(db);
    }
});

module.exports = repositories;
