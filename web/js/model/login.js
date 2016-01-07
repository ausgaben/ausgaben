'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Login(data) {
    this.$context = Login.$context;
    this.email = null;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            if (/^\$/.test(key)) return;
            self[key] = data[key] || undefined;
        });
    }
}

Login.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#login';

module.exports = Login;
