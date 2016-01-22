'use strict';

var transformer = require('../../transformer/user'),
    contentType = require('../../../web/js/util/http').CONTENT_TYPE,
    errors = require('./errors');

module.exports = function (app, config, db, tokenAuth, jsonld) {
    app.get('/api/user/:id', tokenAuth, function (req, res, next) {

        if (req.params.id !== req.user) {
            throw new errors.AccessDeniedError('User', req.url);
        }

        return db.models.User.find({where: {id: req.user}}) // only fetch the current user profile
            .then(function (user) {
                if (user === null) {
                    throw new errors.EntityNotFoundError('User', req.url);
                }

                var model = transformer(user.get({plain: true}));
                model.$id = jsonld.createId(model.$context, user.get('id'));
                res
                    .header('Content-Type', contentType)
                    .send(model);
            })
            .catch(function (err) {
                return next(err);
            });
    });
};
