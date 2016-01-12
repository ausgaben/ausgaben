'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Periodical(data) {
    this.$id = null;
    this.createdAt = null;
    this.type = null;
    this.category = null;
    this.amount = null;
    this.title = null;
    this.starts = null;
    this.estimate = null;
    this.enabledIn01 = null;
    this.enabledIn02 = null;
    this.enabledIn03 = null;
    this.enabledIn04 = null;
    this.enabledIn05 = null;
    this.enabledIn06 = null;
    this.enabledIn07 = null;
    this.enabledIn08 = null;
    this.enabledIn09 = null;
    this.enabledIn10 = null;
    this.enabledIn11 = null;
    this.enabledIn12 = null;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] || null;
        });
        this.createdAt = new Date(this.createdAt);
        this.starts = new Date(this.starts);
    }
    this.$context = Periodical.$context;
}

Periodical.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Periodical';

module.exports = Periodical;
