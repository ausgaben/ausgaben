'use strict';

var HttpProgress = require('../util/http').HttpProgress,
    Spending = require('../model/spending');

module.exports = function (app) {
    app
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('spendings', {
                    url: '/account/:account/spendings',
                    templateUrl: '/view/spendings.html',
                    controllerAs: 'vm',
                    controller: [
                        'account', 'AuthorizedSpendingService', '$state',
                        function (account, AuthorizedSpendingService, $state) {
                            var vm = {
                                account: account,
                                spendings: [],
                                p: new HttpProgress()
                            };

                            vm.submit = function (data) {
                                if (vm.p.$active) {
                                    return;
                                }
                                vm.p.activity();
                                AuthorizedSpendingService.create(new Spending(data))
                                    .then(function () {
                                        vm.p.success();
                                        $state.go($state.current, {}, {reload: true});
                                    })
                                    .catch(function (httpProblem) {
                                        vm.p.error(httpProblem);
                                        throw httpProblem;
                                    });
                            };

                            vm.refresh = function () {
                                if (vm.p.$active) {
                                    return;
                                }
                                vm.p.activity();
                                AuthorizedSpendingService.list()
                                    .then(function (list) {
                                        vm.p.success();
                                        vm.spendings = list.items;
                                    })
                                    .catch(function (httpProblem) {
                                        vm.p.error(httpProblem);
                                        throw httpProblem;
                                    });
                            };
                            vm.refresh();

                            return vm;
                        }
                    ],
                    resolve: {
                        account: [
                            'ClientStorageService', 'AccountService', '$stateParams',
                            function (ClientStorageService, AccountService, $stateParams) {
                                return ClientStorageService.get('token')
                                    .then(function (token) {
                                        return AccountService.get(token, $stateParams.account);
                                    });
                            }
                        ],
                        AuthorizedSpendingService: [
                            'ClientStorageService', 'SpendingService', function (ClientStorageService, SpendingService) {
                                return ClientStorageService.get('token')
                                    .then(function (token) {
                                        return {
                                            create: SpendingService.create.bind(SpendingService, token),
                                            list: SpendingService.list.bind(SpendingService, token)
                                        };
                                    });
                            }
                        ]
                    }
                });
        }])
    ;
};
