'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000'),
    bluebird = require('bluebird'),
    db = require('../../../../../server/config/sequelize'),
    helper = require('../../helper'),
    _ = require('lodash'),
    jsonld = require('../jsonld');

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
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                jsonld.list(res.body, 'https://ausgaben.io/jsonld/Spending', 2);
                var items = _.sortBy(res.body['items'], 'title');
                for(var i = 0; i < 2; i++) {
                    items[i].type.should.be.equal(db.models.Spending.type.SPENDING);
                    items[i].category.should.be.equal('Pets');
                    items[i]['@link'].should.match(/http:\/\/localhost:3000\/spending\/[0-9]+/);
                }
                items[0].amount.should.be.equal(-1234);
                items[0].title.should.be.equal('Cat food');
                items[1].amount.should.be.equal(-5678);
                items[1].title.should.be.equal('Dog food');
                done();
            })
        ;
    });
});
