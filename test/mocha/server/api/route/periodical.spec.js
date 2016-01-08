'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000'),
    bluebird = require('bluebird'),
    db = require('../../../../../server/config/sequelize'),
    helper = require('../../helper'),
    _ = require('lodash'),
    jsonld = require('../jsonld'),
    accept = require('../../../../../web/js/util/http').MIME_TYPE,
    contentType = require('../../../../../web/js/util/http').CONTENT_TYPE;

describe('POST /periodical', function () {
    before(helper.clearDb);

    it('should create a periodical', function (done) {

        var createPeriodical = function (periodical) {
            return new bluebird.Promise(function (resolve, reject) {
                server
                    .post('/periodical')
                    .send(periodical)
                    .set('Content-Type', contentType)
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
            .set('Accept', accept)
            .expect('Content-Type', contentType)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                jsonld.list(res.body, 'https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Periodical', 4);
                var items = _.sortBy(res.body['items'], 'title');
                for (var n = 0; n < 4; n++) {
                    items[n]['@link'].should.match(/http:\/\/localhost:3000\/periodical\/[0-9]+/);
                    items[n].estimate.should.be.equal(false);
                    items[n].enabledIn01.should.be.equal(true);
                    items[n].enabledIn02.should.be.equal(true);
                    items[n].enabledIn03.should.be.equal(true);
                    items[n].enabledIn04.should.be.equal(true);
                    items[n].enabledIn05.should.be.equal(true);
                    items[n].enabledIn06.should.be.equal(true);
                    items[n].enabledIn07.should.be.equal(true);
                    items[n].enabledIn08.should.be.equal(true);
                    items[n].enabledIn09.should.be.equal(true);
                    items[n].enabledIn10.should.be.equal(true);
                    items[n].enabledIn11.should.be.equal(true);
                    items[n].enabledIn12.should.be.equal(true);
                }
                for (var i = 0; i < 2; i++) {
                    items[i].type.should.be.equal(db.models.Spending.type.SPENDING);
                    items[i].category.should.be.equal('Pets');
                }
                for (var j = 2; j < 4; j++) {
                    items[j].type.should.be.equal(db.models.Spending.type.INCOME);
                    items[j].category.should.be.equal('Salary');
                }
                items[0].amount.should.be.equal(-12345);
                items[0].title.should.be.equal('Cat food');
                items[0].starts.should.be.equal('2015-01-03T00:00:00+00:00');
                items[1].amount.should.be.equal(-23456);
                items[1].title.should.be.equal('Dog food');
                items[1].starts.should.be.equal('2015-01-04T00:00:00+00:00');
                items[2].amount.should.be.equal(123456);
                items[2].title.should.be.equal('Markus\' Salary');
                items[2].starts.should.be.equal('2015-01-02T00:00:00+00:00');
                items[3].amount.should.be.equal(165432);
                items[3].title.should.be.equal('Tanja\'s Salary');
                items[3].starts.should.be.equal('2015-01-01T00:00:00+00:00');
                done();
            })
        ;
    });
});
