'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config');

/**
 * Handle all the express-stuff for the server
 *
 * @param  {[type]} app      [description]
 * @param  {[type]} database [description]
 * @return {[type]}          [description]
 */
function initServer(app, database) {
    app.enable('trust proxy');
    app.set('showStackError', true);
    // use json formating
    app.use(bodyParser.json());
    app.set('view engine', 'json');

    require('../api/route/status')(app);

    // Catch all route
    app.use(function (req, res) {
        res.status(404).render('index', {
            data: {
                error: 404
            }
        });
    });
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
