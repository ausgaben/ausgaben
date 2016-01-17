'use strict';

var Spending = require('../model/spending'),
    List = require('../model/list'),
    HttpProblem = require('../model/http-problem'),
    httpUtil = require('../util/http'),
    _ = require('lodash');

/**
 * @param $http
 * @returns {SpendingService}
 */
module.exports = function ($http) {

    function SpendingService() {
    }

    /**
     * @param {JsonWebToken} token
     * @returns {List}|false in a promise
     */
    SpendingService.prototype.list = function (token) {
        return $http.get('/api/spending', _.merge({}, httpUtil.accept(), httpUtil.auth(token)))
            .then(function (response) {
                if (response.data.$context !== List.$context) {
                    return false;
                }
                return new List(response.data.total, response.data.items);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Spending listing failed!');
            });
    };

    /**
     * @param {JsonWebToken} token
     * @param {Spending} spending
     * @returns {Spending}|false in a promise
     */
    SpendingService.prototype.create = function (token, spending) {
        return $http.post('/api/spending', spending, _.merge({}, httpUtil.accept(), httpUtil.auth(token)))
            .then(function (response) {
                if (response.data.$context !== Spending.$context) {
                    return false;
                }
                return new Spending(response.data);
            })
            .catch(function (httpError) {
                throw HttpProblem.fromHttpError(httpError, 'Spending creation failed!');
            });
    };

    return new SpendingService();
};
