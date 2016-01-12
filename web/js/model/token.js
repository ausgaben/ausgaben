'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Token(data) {
    this.$id = null;
    this.lifetime = null;
    this.token = null;
    this.createdAt = null;
    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] || null;
        });
        this.createdAt = new Date(this.createdAt);
    }
    this.$context = Token.$context;
}

Token.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Token';

/**
 * Returns the remaining lifetime of this token in seconds
 *
 * @returns {number}
 */
Token.prototype.timeleft = function () {
    return Math.floor(this.lifetime - (((new Date()).getTime() - this.createdAt.getTime()) / 1000));
};

module.exports = Token;
