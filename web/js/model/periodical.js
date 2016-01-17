'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Periodical(data) {
    this.$id = undefined;
    this.createdAt = undefined;
    this.type = undefined;
    this.category = undefined;
    this.amount = undefined;
    this.title = undefined;
    this.starts = undefined;
    this.estimate = undefined;
    this.enabledIn01 = undefined;
    this.enabledIn02 = undefined;
    this.enabledIn03 = undefined;
    this.enabledIn04 = undefined;
    this.enabledIn05 = undefined;
    this.enabledIn06 = undefined;
    this.enabledIn07 = undefined;
    this.enabledIn08 = undefined;
    this.enabledIn09 = undefined;
    this.enabledIn10 = undefined;
    this.enabledIn11 = undefined;
    this.enabledIn12 = undefined;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? undefined : data[key];
        });
        this.createdAt = new Date(this.createdAt);
        this.starts = new Date(this.starts);
    }
    this.$context = Periodical.$context;
}

Periodical.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Periodical';

module.exports = Periodical;
