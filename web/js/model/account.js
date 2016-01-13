'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Account(data) {
    this.$id = null;
    this.name = null;
    this.createdAt = null;
    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? null : data[key];
        });
        this.createdAt = new Date(this.createdAt);
    }
    this.$context = Account.$context;
}

Account.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Account';

module.exports = Account;
