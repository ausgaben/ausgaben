'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Login(data) {
    this.email = null;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? null : data[key];
        });
    }

    this.$context = Login.$context;
}

Login.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#login';

module.exports = Login;
