'use strict';

/**
 * Module dependencies.
 */
var bodyParser = require('body-parser');
var MIME_TYPE = require('../../web/js/util/http').MIME_TYPE;

/**
 * Handle all the express-stuff for the server
 *
 * @param  {[type]} app      [description]
 * @param  {[type]} database [description]
 * @return {[type]}          [description]
 */
function initServer(app, database) {
    app.enable('trust proxy');
    app.use(bodyParser.json({type: MIME_TYPE}));

    require('../api/route/status')(app);
    require('../api/route/crud')(app, database, 'Periodical');
    require('../api/route/crud')(app, database, 'Spending');
    require('../api/route/registration')(app, database);
}
/**
 * Export the whole initialization-process to the world as module 'express'
 *
 * @param  {[type]} app      [description]
 * @param  {[type]} database [description]
 * @return {[type]}          [description]
 */
module.exports = function (app, database) {
    initServer(app, database);
};
