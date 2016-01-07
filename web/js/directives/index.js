'use strict';

require('angular')
    .module('ausgabenDirectiveModule', [])
    .directive('bootstrapErrorStates', [function() {
        return require('./bootstrap-error-states')();
    }])
    .directive('autoFocus', ['$window', function ($window) {
        return require('./auto-focus')($window);
    }])
;
