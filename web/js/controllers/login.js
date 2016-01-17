'use strict';

var HttpProgress = require('../util/http').HttpProgress,
    Login = require('../model/login');

module.exports = function (app) {
    app
        .controller('LoginController', ['LoginService', function (LoginService) {
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
        }])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '/view/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
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
