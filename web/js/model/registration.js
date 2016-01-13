'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Registration(data) {
    this.email = null;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? null : data[key];
        });
    }
    this.$context = Registration.$context;
}

Registration.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Registration';

module.exports = Registration;
