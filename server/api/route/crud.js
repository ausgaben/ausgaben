'use strict';

var bluebird = require('bluebird'),
    _ = require('lodash'),
    contentType = require('../../../web/js/util/http').CONTENT_TYPE;

var entityUrl = function (entity, req) {
    return req.protocol + '://' + req.get('host') + req.url + '/' + entity.id;
};

module.exports = function (app, db, modelName) {
    var transformer = require('../../transformer/' + modelName.toLowerCase());
    var limit = 10;
    app.post('/api/' + modelName.toLowerCase(), function (req, res, next) {

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
            res
                .status(201)
                .header('Location', entityUrl(entity, req))
                .send();
        }).catch(function (err) {
            return next(err);
        });
    });

    app.get('/api/' + modelName.toLowerCase(), function (req, res, next) {

        var model = db.models[modelName];

        bluebird.try(function () {
            bluebird.join(
                model.count(),
                model.findAll({limit: limit, offset: 0})
            ).spread(function (count, entities) {
                var list = {
                    '$context': 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#List',
                    total: count,
                    items: _.map(entities, function (entity) {
                        var model = transformer(entity);
                        model['$id'] = entityUrl(entity, req);
                        return model;
                    })
                };
                res
                    .header('Content-Type', contentType)
                    .send(list);
            });
        }).catch(function (err) {
            return next(err);
        });
    });

    app.get('/api/' + modelName.toLowerCase() + '/:id', function (req, res, next) {

        bluebird.try(function () {
            db.models[modelName].find({where: {id: req.params.id}}).then(function (entity) {
                if (entity === null) {
                    throw new Error('Unkown entity: ' + req.url);
                }
                var item = transformer(entity);
                item['$id'] = req.url;
                res
                    .header('Content-Type', contentType)
                    .send(item);
            });
        }).catch(function (err) {
            return next(err);
        });
    });
};
