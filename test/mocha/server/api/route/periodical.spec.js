'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000');

describe('POST /periodical', function () {
    it('should create a periodical', function (done) {
        server
            .post('/periodical')
            .send({
                type: 'income',
                category: 'Salary',
                title: 'Tanja\'s Salary',
                amount: 123456,
                starts: '2015-01-01'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Location', /periodical/)
            .expect(201, done);
    });
});
