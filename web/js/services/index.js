'use strict';

require('angular')
    .module('ausgabenServiceModule', [])
    .factory('RegistrationService', ['$http', function ($http) {
        return require('./registration')($http);
    }])
    .factory('LoginService', ['$http', function ($http) {
        return require('./login')($http);
    }])
;
