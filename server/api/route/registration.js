'use strict';

var bluebird = require('bluebird'),
    jwt = require('jsonwebtoken'),
    contentType = require('../../../web/js/util/http').CONTENT_TYPE;

module.exports = function (app, config, db, tokenAuth) {
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
            return jwt.sign(
                {registered: true},
                config.get('private_key'),
                {
                    algorithm: 'RS256',
                    issuer: 'registration',
                    subject: entity.get('id'),
                    expiresIn: config.get('token_lifetime')
                }
            );
        }).then(function (token) {
            return res
                .status(201)
                .header('Content-Type', contentType)
                .send({
                    '$context': 'https://tools.ietf.org/html/rfc7519',
                    token: token
                });
        }).catch(function (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res
                    .status(409)
                    .send();
            }
            return next(err);
        });
    });

    app.post('/api/token/verify', tokenAuth, function (req, res) {
        return res
            .status(204)
            .send();
    });
};
