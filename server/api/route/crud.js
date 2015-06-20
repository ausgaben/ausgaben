'use strict';

var bluebird = require('bluebird');

module.exports = function (app, db, modelName) {
    app.post('/' + modelName.toLowerCase(), function (req, res) {

        var entity;

        bluebird.try(function () {
            entity = db.models[modelName].build(req.body);
            return db.transaction(function (t) {
                // save instance
                return entity.save({
                    transaction: t
                });
            });
        }).then(function () {
            res.status(201).header('Location', req.protocol + '://' + req.hostname + req.url + '/' + entity.id).send();
        }).catch(function (err) {
            res.status(500).send(err);
        });
    });
};
