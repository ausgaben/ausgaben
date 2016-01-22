'use strict';

var expect = require('chai').expect,
    User = require('../../../../web/js/model/user'),
    JSONLD = require('../../../../server/api/jsonld');

describe('jsonld', function () {
    var jsonld;

    before(function (done) {
        jsonld = new JSONLD('http://example.com/');
        done();
    });

    it('should create an $id link', function (done) {
        expect(jsonld.createId(User.$context, 42)).to.equal('http://example.com/api/user/42');
        done();
    });

    it('should parse an $id link', function (done) {
        expect(jsonld.parseId(User.$context, 'http://example.com/api/user/42')).to.equal('42');
        done();
    });
});
