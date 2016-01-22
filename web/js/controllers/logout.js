'use strict';

module.exports = function (app) {
    app
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('logout', {
                    url: '/logout',
                    controller: ['ClientStorageService', '$state', function (ClientStorageService, $state) {
                        ClientStorageService.remove('token')
                            .then(function () {
                                $state.go('login');
                            });
                    }],
                    template: '<!-- blank -->'
                });
        }])
    ;
};
