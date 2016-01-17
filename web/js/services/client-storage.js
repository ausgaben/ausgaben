'use strict';

var bluebird = require('bluebird');

/**
 * @param $window
 * @returns {ClientStorageService}
 */
module.exports = function ($window) {

    function ClientStorageService() {
    }

    /**
     * Store a value
     * @param {String} name
     * @param {Object} value
     * @returns {Promise}
     */
    ClientStorageService.prototype.set = function (name, value) {
        return bluebird.try(function () {
            return $window.localStorage.setItem(name, JSON.stringify(value));
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
        return bluebird.try(function () {
            return $window.localStorage.removeItem(name);
        });
    };

    return new ClientStorageService();
};
