'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000');

describe('GET /status', function () {
    it('responds with ok', function (done) {
        server
            .get('/status')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.body.should.have.property('status', 'ok');
            })
            .expect(200, done);
    });
});
