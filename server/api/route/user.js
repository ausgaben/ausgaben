'use strict';

var transformer = require('../../transformer/user'),
    contentType = require('../../../web/js/util/http').CONTENT_TYPE;

module.exports = function (app, config, db, tokenAuth, jsonld) {
    app.get('/api/user/:id', tokenAuth, function (req, res) {

        db.models.User.find({where: {id: req.user}}) // only fetch the current user profile
            .then(function (user) {
                if (user === null) {
                    throw new Error('Unkown entity: ' + req.url);
                }

                var model = transformer(user.get({plain: true}));
                model.$id = jsonld.createId(model.$context, user.get('id'));
                res
                    .header('Content-Type', contentType)
                    .send(model);
            });
    });
};
