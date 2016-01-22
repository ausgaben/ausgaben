'use strict';

require('angular')
    .module('ausgabenServiceModule', [])
    .factory('RegistrationService', ['$http', function ($http) {
        return require('./registration')($http);
    }])
    .factory('LoginService', ['$http', function ($http) {
        return require('./login')($http);
    }])
    .factory('ClientStorageService', ['$window', '$rootScope', function ($window, $rootScope) {
        return require('./client-storage')($window, $rootScope);
    }])
    .factory('AccountService', ['$http', function ($http) {
        return require('./account')($http);
    }])
    .factory('SpendingService', ['$http', function ($http) {
        return require('./spending')($http);
    }])
    .factory('UserService', ['$http', function ($http) {
        return require('./user')($http);
    }])
;
