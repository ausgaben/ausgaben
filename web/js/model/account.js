'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Account(data) {
    this.$id = undefined;
    this.name = undefined;
    this.createdAt = undefined;
    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? undefined : data[key];
        });
        this.createdAt = new Date(this.createdAt);
    }
    this.$context = Account.$context;
}

Account.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Account';

module.exports = Account;
