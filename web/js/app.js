'use strict';

require('bluebird').longStackTraces();

require('angular-ui-router');
var app = require('angular')
    .module('ausgabenApp', [
        'ui.router',
        require('angular-bluebird-promises'),
        'ausgabenConfigModule',
        'ausgabenDirectiveModule',
        'ausgabenFilterModule',
        'ausgabenServiceModule'
    ]);

app
    .config(['$interpolateProvider', function ($interpolateProvider) {
        $interpolateProvider.startSymbol('%%');
        $interpolateProvider.endSymbol('%%');
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('!');
    }])
;
require('./directives/index');
require('./services/index');
require('./filters/index');
require('./controllers/index')(app);
