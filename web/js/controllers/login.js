'use strict';

var HttpProgress = require('../util/http').HttpProgress,
    Login = require('../model/login'),
    JsonWebToken = require('../model/jsonwebtoken');

module.exports = function (app) {
    app
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '/view/login.html',
                    controllerAs: 'vm',
                    controller: ['LoginService', function (LoginService) {
                        var vm = {};

                        vm.p = new HttpProgress();

                        vm.submit = function (data) {
                            if (vm.p.$active) {
                                return;
                            }
                            vm.p.activity();
                            LoginService.create(new Login(data))
                                .then(function () {
                                    vm.p.success();
                                })
                                .catch(function (httpProblem) {
                                    vm.p.error(httpProblem);
                                    throw httpProblem;
                                });
                        };

                        return vm;
                    }]
                })
                .state('loginLink', {
                    url: '/loginLink/:token',
                    templateUrl: '/view/loginLink.html',
                    controllerAs: 'vm',
                    controller: [
                        'ClientStorageService',
                        '$state',
                        '$stateParams',
                        function (ClientStorageService, $state, $stateParams) {
                            var token = new JsonWebToken($stateParams.token);
                            ClientStorageService.set('token', token)
                                .then(function () {
                                    $state.go('accounts');
                                });
                            return {};
                        }
                    ]
                })
            ;
        }])
    ;
    // Default route
    app
        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise(function ($injector) {
                var $state = $injector.get('$state');
                $state.go('login');
            });
        }]);
};
