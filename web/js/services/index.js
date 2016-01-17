'use strict';

require('angular')
    .module('ausgabenServiceModule', [])
    .factory('RegistrationService', ['$http', function ($http) {
        return require('./registration')($http);
    }])
    .factory('LoginService', ['$http', function ($http) {
        return require('./login')($http);
    }])
    .factory('ClientStorageService', ['$window', function ($window) {
        return require('./client-storage')($window);
    }])
    .factory('AccountService', ['$http', function ($http) {
        return require('./account')($http);
    }])
    .factory('SpendingService', ['$http', function ($http) {
        return require('./spending')($http);
    }])
;
