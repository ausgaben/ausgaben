'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000'),
    bluebird = require('bluebird'),
    db = require('../../../../../server/config/sequelize'),
    helper = require('../../helper');

describe('POST /periodical', function () {
    before(helper.clearDb);

    it('should create a periodical', function (done) {

        var createPeriodical = function (periodical) {
            return new bluebird.Promise(function (resolve, reject) {
                server
                    .post('/periodical')
                    .send(periodical)
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .expect('Location', /periodical/)
                    .end(function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
                ;
            });
        };

        bluebird.join(
            createPeriodical({
                type: db.models.Spending.type.INCOME,
                category: 'Salary',
                title: 'Tanja\'s Salary',
                amount: 165432,
                starts: '2015-01-01'
            }),
            createPeriodical({
                type: db.models.Spending.type.INCOME,
                category: 'Salary',
                title: 'Markus\' Salary',
                amount: 123456,
                starts: '2015-01-02'
            }),
            createPeriodical({
                type: db.models.Spending.type.SPENDING,
                category: 'Pets',
                title: 'Cat food',
                amount: -12345,
                starts: '2015-01-03'
            }),
            createPeriodical({
                type: db.models.Spending.type.SPENDING,
                category: 'Pets',
                title: 'Dog food',
                amount: -23456,
                starts: '2015-01-04'
            })
        ).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('should list the created periodicals', function (done) {
        server
            .get('/periodical')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                '@context': 'https://ausgaben.io/jsonld/List',
                total: 4,
                items: [
                    {
                        '@context': 'https://ausgaben.io/jsonld/Periodical',
                        '@link': 'http://localhost:3000/periodical/1',
                        type: db.models.Spending.type.INCOME,
                        category: 'Salary',
                        amount: 165432,
                        title: 'Tanja\'s Salary',
                        starts: '2015-01-01T00:00:00+00:00',
                        estimate: false,
                        enabledIn01: true,
                        enabledIn02: true,
                        enabledIn03: true,
                        enabledIn04: true,
                        enabledIn05: true,
                        enabledIn06: true,
                        enabledIn07: true,
                        enabledIn08: true,
                        enabledIn09: true,
                        enabledIn10: true,
                        enabledIn11: true,
                        enabledIn12: true
                    },
                    {
                        '@context': 'https://ausgaben.io/jsonld/Periodical',
                        '@link': 'http://localhost:3000/periodical/2',
                        type: db.models.Spending.type.INCOME,
                        category: 'Salary',
                        amount: 123456,
                        title: 'Markus\' Salary',
                        starts: '2015-01-02T00:00:00+00:00',
                        estimate: false,
                        enabledIn01: true,
                        enabledIn02: true,
                        enabledIn03: true,
                        enabledIn04: true,
                        enabledIn05: true,
                        enabledIn06: true,
                        enabledIn07: true,
                        enabledIn08: true,
                        enabledIn09: true,
                        enabledIn10: true,
                        enabledIn11: true,
                        enabledIn12: true
                    },
                    {
                        '@context': 'https://ausgaben.io/jsonld/Periodical',
                        '@link': 'http://localhost:3000/periodical/3',
                        type: db.models.Spending.type.SPENDING,
                        category: 'Pets',
                        amount: -12345,
                        title: 'Cat food',
                        starts: '2015-01-03T00:00:00+00:00',
                        estimate: false,
                        enabledIn01: true,
                        enabledIn02: true,
                        enabledIn03: true,
                        enabledIn04: true,
                        enabledIn05: true,
                        enabledIn06: true,
                        enabledIn07: true,
                        enabledIn08: true,
                        enabledIn09: true,
                        enabledIn10: true,
                        enabledIn11: true,
                        enabledIn12: true
                    },
                    {
                        '@context': 'https://ausgaben.io/jsonld/Periodical',
                        '@link': 'http://localhost:3000/periodical/4',
                        type: db.models.Spending.type.SPENDING,
                        category: 'Pets',
                        amount: -23456,
                        title: 'Dog food',
                        starts: '2015-01-04T00:00:00+00:00',
                        estimate: false,
                        enabledIn01: true,
                        enabledIn02: true,
                        enabledIn03: true,
                        enabledIn04: true,
                        enabledIn05: true,
                        enabledIn06: true,
                        enabledIn07: true,
                        enabledIn08: true,
                        enabledIn09: true,
                        enabledIn10: true,
                        enabledIn11: true,
                        enabledIn12: true
                    }
                ]
            }, done)
        ;
    });
});
