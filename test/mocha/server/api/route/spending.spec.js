'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000'),
    bluebird = require('bluebird'),
    db = require('../../../../../server/config/sequelize'),
    helper = require('../../helper');

describe('POST /spending', function () {
    before(helper.clearDb);

    it('should create some spendings', function (done) {

        /**
         * @param spending
         * @returns {bluebird.Promise}
         */
        var createSpending = function (spending) {
            return new bluebird.Promise(function (resolve, reject) {
                server
                    .post('/spending')
                    .send(spending)
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .expect('Location', /spending/)
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
            createSpending({
                type: db.models.Spending.type.SPENDING,
                category: 'Pets',
                'amount': -1234,
                'title': 'Cat food'
            }),
            createSpending({
                type: db.models.Spending.type.SPENDING,
                category: 'Pets',
                'amount': -5678,
                'title': 'Dog food'
            })
        ).then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
    });

    it('should list the created spendings', function (done) {
        server
            .get('/spending')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                '@context': 'https://ausgaben.io/jsonld/List',
                total: 2,
                items: [
                    {
                        '@context': 'https://ausgaben.io/jsonld/Spending',
                        '@link': 'http://localhost:3000/spending/1',
                        type: db.models.Spending.type.SPENDING,
                        category: 'Pets',
                        'amount': -1234,
                        'title': 'Cat food'
                    },
                    {
                        '@context': 'https://ausgaben.io/jsonld/Spending',
                        '@link': 'http://localhost:3000/spending/2',
                        type: db.models.Spending.type.SPENDING,
                        category: 'Pets',
                        'amount': -5678,
                        'title': 'Dog food'
                    }
                ]
            }, done)
        ;
    });
});
