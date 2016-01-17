'use strict';

var _ = require('lodash');

/**
 * @param {object} data
 * @constructor
 */
function Spending(data) {
    this.$id = undefined;
    this.createdAt = undefined;
    this.booked = undefined;
    this.bookedAt = undefined;
    this.type = undefined;
    this.category = undefined;
    this.amount = undefined;
    this.title = undefined;

    if (data) {
        var self = this;
        _.forEach(this, function (value, key) {
            self[key] = data[key] === undefined ? undefined : data[key];
        });
        this.createdAt = new Date(this.createdAt);
    }
    this.$context = Spending.$context;
}

Spending.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Spending';

module.exports = Spending;
