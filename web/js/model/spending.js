'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Spending(data) {
    this.$id = null;
    this.createdAt = null;
    this.booked = null;
    this.bookedAt = null;
    this.type = null;
    this.category = null;
    this.amount = null;
    this.title = null;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? null : data[key];
        });
        this.createdAt = new Date(this.createdAt);
    }
    this.$context = Spending.$context;
}

Spending.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Spending';

module.exports = Spending;
