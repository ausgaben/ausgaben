'use strict';

var bluebird = require('bluebird'),
    _ = require('lodash'),
    list = require('../../../web/js/model/list'),
    contentType = require('../../../web/js/util/http').CONTENT_TYPE;

var entityUrl = function (entity, req) {
    return req.protocol + '://' + req.get('host') + req.url + '/' + entity.id;
};

module.exports = function (app, tokenAuth, db, modelName, prefix) {
    var transformer = require('../../transformer/' + modelName.toLowerCase());
    var limit = 10;
    prefix = '/' + _.trim(prefix, '/') + '/';

    function fetchParents(req) {
        var parents = {};
        var parentMatch = req.route.path.match(/(:[a-z]+)+/g);

        return bluebird.map(_.filter(parentMatch, function (match) {
            return match !== ':id';
        }), function (parentParam) {
            var parentClass = parentParam.charAt(1).toUpperCase() + parentParam.substr(2);
            var parentId = req.params[parentParam.substr(1)];
            return db.models[parentClass].findById(+parentId).then(function (entity) {
                if (entity === null) {
                    throw new Error('Unkown ' + parentClass + ': ' + parentId);
                }
                return bluebird.try(function () {
                    if (entity.getUsers) {
                        return entity.getUsers()
                            .filter(function (user) {
                                return user.get('id') === req.user;
                            });
                    }
                    return true;
                })
                .then(function (found) {
                    if (found) {
                        parents[parentClass] = entity;
                        return;
                    }
                    throw new Error('Not allowed.');
                });
            });
        }).then(function () {
            return parents;
        });
    }

    app.post(prefix + modelName.toLowerCase(), tokenAuth, function (req, res, next) {

        var entity;

        fetchParents(req)
            .then(function (parents) {
                entity = db.models[modelName].build(req.body);
                _.map(parents, function (parent, parentClass) {
                    entity['set' + parentClass](parent, {save: false});
                });
                entity['setCreator'](req.user, {save: false});
                return db.transaction(function (t) {
                    // save instance
                    return entity.save({
                        transaction: t
                    });
                });
            }).then(function () {
                if (entity.addUser) {
                    return entity.addUser(req.user);
                }
            }).then(function () {
                res
                    .status(201)
                    .header('Location', entityUrl(entity, req))
                    .send();
            }).catch(function (err) {
                return next(err);
            });
    });

    app.get(prefix + modelName.toLowerCase(), tokenAuth, function (req, res, next) {

        var model = db.models[modelName];
        var entity = model.build();

        fetchParents(req)
            .then(function (parents) {
                var q = {limit: limit, offset: 0};
                if (parents) {
                    q.where = {};
                    _.map(parents, function (parent, parentClass) {
                        q.where[parentClass + 'Id'] = parent.get('id');
                    });
                }
                var countQuery = model.count(q);
                if (entity.addUser) {
                    q.include = [{
                        model: db.models.User,
                        through: {
                            where: {
                                UserId: req.user
                            }
                        },
                        required: true
                    }];
                    q.include[0].through[model + 'Id'] = db.col('id');
                    // Use different approach to count, because https://github.com/sequelize/sequelize/issues/3256
                    countQuery = db.models.UserAccount.count({
                        where: {
                            'UserId': req.user
                        }
                    });
                }

                bluebird.join(
                    countQuery,
                    model.findAll(q)
                ).spread(function (count, entities) {
                    var items = _.map(entities, function (entity) {
                        var model = transformer(entity.get({plain: true}));
                        model.$id = entityUrl(entity, req);
                        return model;
                    });
                    res
                        .header('Content-Type', contentType)
                        .send(new list(count, items));
                });
            }).catch(function (err) {
                return next(err);
            });
    });

    app.get(prefix + modelName.toLowerCase() + '/:id', tokenAuth, function (req, res, next) {

        bluebird.try(function () {
            db.models[modelName].find({where: {id: req.params.id}}).then(function (entity) {
                if (entity === null) {
                    throw new Error('Unkown entity: ' + req.url);
                }
                var item = transformer(entity.get({plain: true}));
                item.$id = req.url;
                res
                    .header('Content-Type', contentType)
                    .send(item);
            });
        }).catch(function (err) {
            return next(err);
        });
    });
};
