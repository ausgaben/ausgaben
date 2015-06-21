'use strict';

var sequelize = require('../../../server/config/sequelize');
var request = require('supertest');
var bluebird = require('bluebird');
bluebird.promisifyAll(request);

before(function () {
    // recreating the sequelize takes a bit => disable timeout
    this.timeout(0);
    console.log('Recreate all tables');
    // Synchronizing any model changes with database.
    return sequelize.sync({
        force: true
    }).catch(function (err) {
        console.error(err);
        process.exit(1);
    });
});
