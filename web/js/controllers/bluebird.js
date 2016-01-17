'use strict';

module.exports = function () {
    require('angular')
        .module('mwl.bluebird')
        .run(['$q', '$log', '$state', function ($q, $log, $state) {
            $q.onPossiblyUnhandledRejection(function (error) {
                var errorName = errorName || error.constructor.name;
                // Ignore exceptions for handling routing
                if (errorName.match(/(RejectRouteError|TransitionRejection)/)) {
                    return;
                }
                if (errorName === 'HttpProblem' && error.status === 403) {
                    $state.go('logout');
                    return;
                }
                $log.error('Unhandled rejection', error);
            });
        }]);

};
