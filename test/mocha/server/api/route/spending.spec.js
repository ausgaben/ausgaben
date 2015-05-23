'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000');

describe('POST /spending', function () {
    it('should create a spending', function (done) {
        server
            .post('/spending')
            .send({'amount': 1234, 'description': 'Catfood'})
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Location', /spending/)
            .expect(201, done);
    });
});
