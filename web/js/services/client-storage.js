'use strict';

var bluebird = require('bluebird');

/**
 * @param $window
 * @param $rootScope
 * @returns {ClientStorageService}
 */
module.exports = function ($window, $rootScope) {

    function ClientStorageService() {
        var self = this;
        self.get('token').then(function(token) {
            if (token) {
                self.notify('token', token);
            }
        });
    }

    /**
     * Store a value
     * @param {String} name
     * @param {Object} value
     * @returns {Promise}
     */
    ClientStorageService.prototype.set = function (name, value) {
        var self = this;
        return bluebird.try(function () {
            return $window.localStorage.setItem(name, JSON.stringify(value));
        })
            .then(function() {
                self.notify(name, value);
            });
    };

    /**
     * Retrieve a value
     * @param {String} name
     * @returns {Promise}
     */
    ClientStorageService.prototype.get = function (name) {
        return bluebird.try(function () {
            return JSON.parse($window.localStorage.getItem(name));
        });
    };

    /**
     * Remove a value
     * @param {String} name
     * @returns {Promise}
     */
    ClientStorageService.prototype.remove = function (name) {
        var self = this;
        return bluebird.try(function () {
            return $window.localStorage.removeItem(name);
        })
            .then(function() {
                self.notify(name, undefined);
            });
    };

    ClientStorageService.prototype.subscribe = function (scope, callback) {
        var handler = $rootScope.$on('clientstorage-event', callback);
        scope.$on('$destroy', handler);
    };

    ClientStorageService.prototype.notify = function (name, value) {
        $rootScope.$emit('clientstorage-event', name, value);
    };

    return new ClientStorageService();
};
