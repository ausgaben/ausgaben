'use strict';

/**
 * Module dependencies.
 */
var bodyParser = require('body-parser');

/**
 * Handle all the express-stuff for the server
 *
 * @param  {[type]} app      [description]
 * @param  {[type]} database [description]
 * @return {[type]}          [description]
 */
function initServer(app, database) {
    app.enable('trust proxy');
    // use json formating
    app.use(bodyParser.json());

    require('../api/route/status')(app);
    require('../api/route/crud')(app, database, 'Periodical');
    require('../api/route/crud')(app, database, 'Spending');
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
