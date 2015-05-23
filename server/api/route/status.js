'use strict';

module.exports = function (app) {
    app.get('/status', function (req, res) {
        res.status(200).send({'status': 'ok'});
    });
};
