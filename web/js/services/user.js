'use strict';

var User = require('../model/user'),
    HttpProblem = require('../model/http-problem'),
    httpUtil = require('../util/http'),
    _ = require('lodash');

/**
 * @param $http
 * @returns {UserService}
 */
module.exports = function ($http) {

    function UserService() {
    }

    /**
     * @param {JsonWebToken} token
     * @param {string} id
     * @returns {User}|false in a promise
     */
    UserService.prototype.get = function (token, id) {
        return $http.get(id, _.merge({}, httpUtil.accept(), httpUtil.auth(token)))
            .then(function (response) {
                if (response.data.$context !== User.$context) {
                    return false;
                }
                return new User(response.data);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'User fetching failed!');
            });
    };

    return new UserService();
};
