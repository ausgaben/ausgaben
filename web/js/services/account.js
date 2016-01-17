'use strict';

var Account = require('../model/account'),
    List = require('../model/list'),
    HttpProblem = require('../model/http-problem'),
    httpUtil = require('../util/http'),
    _ = require('lodash');

/**
 * @param $http
 * @returns {AccountService}
 */
module.exports = function ($http) {

    function AccountService() {
    }

    /**
     * @param {JsonWebToken} token
     * @returns {List}|false in a promise
     */
    AccountService.prototype.list = function (token) {
        return $http.get('/api/account', _.merge({}, httpUtil.accept(), httpUtil.auth(token)))
            .then(function (response) {
                if (response.data.$context !== List.$context) {
                    return false;
                }
                return new List(response.data.total, response.data.items);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Account listing failed!');
            });
    };

    /**
     * @param {JsonWebToken} token
     * @param {string} id
     * @returns {Account}|false in a promise
     */
    AccountService.prototype.get = function (token, id) {
        return $http.get(id, _.merge({}, httpUtil.accept(), httpUtil.auth(token)))
            .then(function (response) {
                if (response.data.$context !== Account.$context) {
                    return false;
                }
                return new Account(response.data);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Account fetching failed!');
            });
    };

    /**
     * @param {JsonWebToken} token
     * @param {Account} account
     * @returns {Account}|false in a promise
     */
    AccountService.prototype.create = function (token, account) {
        return $http.post('/api/account', account, _.merge({}, httpUtil.accept(), httpUtil.auth(token)))
            .then(function (response) {
                if (response.data.$context !== Account.$context) {
                    return false;
                }
                return new Account(response.data);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Account creation failed!');
            });
    };

    return new AccountService();
};
