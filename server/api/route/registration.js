'use strict';

var bluebird = require('bluebird'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config'),
    contentType = require('../../../web/js/util/http').CONTENT_TYPE;

module.exports = function (app, db) {
    app.post('/api/registration', function (req, res, next) {

        var entity;

        bluebird.try(function () {
            entity = db.models['User'].build(req.body);
            return db.transaction(function (t) {
                // save instance
                return entity.save({
                    transaction: t
                });
            });
        }).then(function () {
            var token = jwt.sign(
                {registered: true},
                config.get('private_key'),
                {
                    algorithm: 'RS256',
                    issuer: 'registration',
                    subject: entity.get('email')
                }
            );
            res
                .status(201)
                .header('Content-Type', contentType)
                .send({
                    '$context': 'https://tools.ietf.org/html/rfc7519',
                    token: token
                });
        }).catch(function (err) {
            return next(err);
        });
    });
};
