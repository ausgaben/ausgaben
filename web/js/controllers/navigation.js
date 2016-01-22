'use strict';

module.exports = function (app) {
    app
        .controller('NavigationController', [
            'UserService',
            'ClientStorageService',
            '$scope',
            function (UserService, ClientStorageService, $scope) {
                var vm = {};

                ClientStorageService.subscribe($scope, function (event, property, value) {
                    if (property === 'token') {
                        if (value === undefined) {
                            delete vm.me;
                        } else {
                            UserService.get(value, value.sub)
                                .then(function (user) {
                                    vm.me = user;
                                });
                        }
                    }
                });

                return vm;
            }
        ]);
};
