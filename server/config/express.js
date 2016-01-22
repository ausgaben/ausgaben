'use strict';

/**
 * Module dependencies.
 */
var bodyParser = require('body-parser'),
    MIME_TYPE = require('../../web/js/util/http').MIME_TYPE,
    HttpProblem = require('../../web/js/model/http-problem'),
    crud = require('../api/route/crud'),
    passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    User = require('../../web/js/model/user'),
    jwt = require('jsonwebtoken');

module.exports = function (app, config, database, jsonld) {
    app.enable('trust proxy');
    app.use(bodyParser.json({type: MIME_TYPE}));

    app.use(passport.initialize());
    passport.use(new BearerStrategy(
        function (token, cb) {
            jwt.verify(token, config.get('public_key'), {algorithms: ['RS256']}, function (err, decoded) {
                if (!decoded) {
                    return cb(err);
                }
                return cb(null, jsonld.parseId(User.$context, decoded.sub), decoded);
            });
        }));
    var tokenAuth = passport.authenticate('bearer', {session: false});

    require('../api/route/status')(app);
    crud(app, tokenAuth, database, 'Periodical', '/api/account/:account/');
    crud(app, tokenAuth, database, 'Spending', '/api/account/:account/');
    crud(app, tokenAuth, database, 'Account', '/api/');
    require('../api/route/registration')(app, config, database, jsonld);
    require('../api/route/token')(app, config, database, tokenAuth);
    require('../api/route/login')(app, config, database);
    require('../api/route/user')(app, config, database, tokenAuth, jsonld);

    app.use(function (err, req, res, next) {
        if (err.name === 'TokenExpiredError' || err.name === 'AccessDeniedError') {
            res.status(403)
                .send(
                    new HttpProblem(
                        'https://github.com/ausgaben/ausgaben-node/wiki/HttpProblem#403', err.name, 403, err.message
                    )
                );
            return next();
        }
        if (err.name === 'EntityNotFoundError') {
            res.status(404)
                .send(
                    new HttpProblem(
                        'https://github.com/ausgaben/ausgaben-node/wiki/HttpProblem#404', err.name, 404, err.message
                    )
                );
            return next();
        }
        console.error(err.name);
        console.error(req.method + ' ' + req.url);
        console.error(err.message);
        console.error(err.stack);
        res.status(500).send(err);
        next();
    });
};
