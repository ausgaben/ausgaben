'use strict';

require('should');

var _ = require('lodash');

function list(list, context, n) {
    list['@context'].should.be.equal('https://ausgaben.io/jsonld/List');
    list['total'].should.be.equal(n);
    list['items'].should.have.a.lengthOf(n);
    _.map(list['items'], function (item) {
        item['@context'].should.be.equal(context);
    });
}

module.exports = {
    list: list
};
