'use strict';

var sequelize = require('../../../server/config/sequelize');
var request = require('supertest');
var bluebird = require('bluebird');
bluebird.promisifyAll(request);

exports.clearDb = function () {
    // recreating the sequelize takes a bit => disable timeout
    this.timeout(0);
    // Synchronizing any model changes with database.
    return sequelize.sync({
        force: true
    }).catch(function (err) {
        console.error(err);
        process.exit(1);
    });
};

// Configure parsing for superagent
var mime = require('../../../web/js/util/http').MIME_TYPE;
require('superagent').serialize[mime] = JSON.stringify;
