'use strict';

var Registration = require('../model/registration'),
    HttpProblem = require('../model/http-problem'),
    httpUtil = require('../util/http');

/**
 * @param $http
 * @returns {RegistrationService}
 */
module.exports = function ($http) {

    function RegistrationService() {
    }

    /**
     * @param {Registration} registration
     * @returns {Registration}|false in a promise
     */
    RegistrationService.prototype.create = function (registration) {
        return $http.post('/api/registration', registration, httpUtil.accept())
            .then(function (response) {
                if (response.data.$context !== Registration.$context) {
                    return false;
                }
                return true;
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Registration failed!');
            });
    };

    return new RegistrationService();
};
