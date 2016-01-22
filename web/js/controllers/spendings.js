'use strict';

var HttpProgress = require('../util/http').HttpProgress,
    Spending = require('../model/spending');

module.exports = function (app) {
    app
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('spendings', {
                    url: '/account/:name/spendings?id',
                    templateUrl: '/view/spendings.html',
                    controllerAs: 'vm',
                    controller: [
                        'AuthorizedAccountService', 'AuthorizedSpendingService', '$state', '$stateParams',
                        function (AuthorizedAccountService, AuthorizedSpendingService, $state, $stateParams) {
                            var vm = {
                                account: undefined,
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

                                AuthorizedAccountService.get(atob($stateParams.id))
                                    .then(function (account) {
                                        vm.account = account;
                                        return account.$links[Spending.$context].list;
                                    })
                                    .then(function (spendingLink) {
                                        AuthorizedSpendingService.list(spendingLink)
                                            .then(function (list) {
                                                vm.p.success();
                                                vm.spendings = list.items;
                                            });
                                    })
                                    .catch(function (httpProblem) {
                                        vm.p.error(httpProblem);
                                        throw httpProblem;
                                    })
                                ;
                            };
                            vm.refresh();

                            return vm;
                        }
                    ],
                    resolve: {
                        AuthorizedAccountService: [
                            'ClientStorageService', 'AccountService', function (ClientStorageService, AccountService) {
                                return ClientStorageService.get('token')
                                    .then(function (token) {
                                        return {
                                            get: AccountService.get.bind(AccountService, token)
                                        };
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
