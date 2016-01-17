'use strict';

/**
 * @param {Number} total
 * @param {object} items
 * @constructor
 */
function List(total, items) {
    this.total = total;
    this.items = items;
    this.$context = List.$context;
}

List.$context = 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#List';

module.exports = List;
