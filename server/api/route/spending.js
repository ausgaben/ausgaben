'use strict';

var sequelize = require('../../config/sequelize'),
    bluebird = require('bluebird');

module.exports = function (app) {
    app.post('/spending', function (req, res) {

        var Spending;

        bluebird.try(function () {
            Spending = sequelize.models['Spending'].build(req.body);
            return sequelize.transaction(function (t) {
                // save instance
                return Spending.save({
                    transaction: t
                });
            });
        }).then(function () {
            res.status(201).header('Location', req.protocol + '://' + req.hostname + req.url + '/' + Spending.id).send();
        }).catch(function (err) {
            res.status(500).send(err);
        });
    });
};
