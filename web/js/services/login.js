'use strict';

var Login = require('../model/login'),
    HttpProblem = require('../model/http-problem'),
    httpUtil = require('../util/http');

/**
 * @param $http
 * @returns {LoginService}
 */
module.exports = function ($http) {

    function LoginService() {
    }

    /**
     * @param {Login} login
     * @returns {Login}|false in a promise
     */
    LoginService.prototype.create = function (login) {
        return $http.post('/api/login', login, httpUtil.accept())
            .then(function (response) {
                if (response.data.$context !== Login.$context) {
                    return false;
                }
                return true;
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Login failed!');
            });
    };

    return new LoginService();
};
