'use strict';

require('angular')
    .module('ausgabenFilterModule', [])
    .filter('idparam', ['$location', function ($location) {
        return require('./idparam')($location);
    }])
;
