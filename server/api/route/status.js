'use strict';

var contentType = require('../../../web/js/util/http').CONTENT_TYPE;

module.exports = function (app) {
    app.get('/status', function (req, res) {
        res
            .status(200)
            .header('Content-Type', contentType)
            .send({'status': 'ok'});
    });
};
