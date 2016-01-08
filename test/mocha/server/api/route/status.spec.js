'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000'),
    accept = require('../../../../../web/js/util/http').MIME_TYPE,
    contentType = require('../../../../../web/js/util/http').CONTENT_TYPE;

describe('GET /status', function () {
    it('responds with ok', function (done) {
        server
            .get('/status')
            .set('Accept', accept)
            .expect('Content-Type', contentType)
            .expect(function (res) {
                res.body.should.have.property('status', 'ok');
            })
            .expect(200, done);
    });
});
