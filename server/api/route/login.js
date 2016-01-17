'use strict';

var EventEmitter = require('../../emitter');

module.exports = function (app) {
    app.post('/api/login', function (req, res, next) {
        EventEmitter.emit('login_link_requested', req.body.email);
        res
            .status(202)
            .send();
        return next();
    });
};
