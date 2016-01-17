'use strict';

var JsonWebToken = require('../model/jsonwebtoken'),
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
                if (response.data.$context !== JsonWebToken.$context) {
                    return false;
                }
                return new JsonWebToken(response.data.token);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Registration failed!');
            });
    };

    return new RegistrationService();
};
