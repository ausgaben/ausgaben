'use strict';

module.exports = function () {
    require('angular')
        .module('mwl.bluebird')
        .run(['$q', '$log', function ($q, $log) {
            $q.onPossiblyUnhandledRejection(function (error) {
                var errorName = errorName || error.constructor.name;
                // Ignore exceptions for handling routing
                if (errorName.match(/(RejectRouteError|TransitionRejection)/)) {
                    return;
                }
                $log.error('Unhandled rejection', error);
            });
        }]);

};
