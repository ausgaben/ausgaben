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
    jwt = require('jsonwebtoken');

/**
 * Handle all the express-stuff for the server
 */
function initServer(app, config, database) {
    app.enable('trust proxy');
    app.use(bodyParser.json({type: MIME_TYPE}));

    app.use(passport.initialize());
    passport.use(new BearerStrategy(
        function (token, cb) {
            jwt.verify(token, config.get('public_key'), {algorithms: ['RS256']}, function (err, decoded) {
                if (!decoded) {
                    return cb(err);
                }
                return cb(null, decoded.sub, decoded);
            });
        }));
    var tokenAuth = passport.authenticate('bearer', {session: false});

    require('../api/route/status')(app);
    crud(app, tokenAuth, database, 'Periodical', '/api/account/:account/');
    crud(app, tokenAuth, database, 'Spending', '/api/account/:account/');
    crud(app, tokenAuth, database, 'Account', '/api/');
    require('../api/route/registration')(app, config, database, tokenAuth);
    require('../api/route/token')(app, config, database, tokenAuth);
    require('../api/route/login')(app, config, database);

    app.use(function (err, req, res, next) {
        if (err.name === 'TokenExpiredError') {
            res.status(403)
                .send(
                    new HttpProblem(
                        'https://github.com/ausgaben/ausgaben-node/wiki/HttpProblem#403', err.name, 403, err.message
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
}
/**
 * Export the whole initialization-process to the world as module 'express'
 */
module.exports = function (app, config, database) {
    initServer(app, config, database);
};
