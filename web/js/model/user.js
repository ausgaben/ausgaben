'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function User(data) {
    this.$id = undefined;
    this.email = undefined;
    this.createdAt = undefined;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? undefined : data[key];
        });
        this.createdAt = new Date(this.createdAt);
    }
    this.$context = User.$context;
}

User.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#User';

module.exports = User;
