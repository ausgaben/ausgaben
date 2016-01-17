'use strict';

module.exports = function (app, config, db, tokenAuth) {
    app.post('/api/token/verify', tokenAuth, function (req, res) {
        return res
            .status(204)
            .send();
    });
};
