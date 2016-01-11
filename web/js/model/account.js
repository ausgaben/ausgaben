'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Account(data) {
    this.$context = Account.$context;
    this.$id = null;
    this.name = null;
    this.createdAt = null;
    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] || null;
        });
        this.createdAt = new Date(this.createdAt);
    }
}

Account.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#account';

module.exports = Account;
