'use strict';

require('should');

var request = require('supertest'),
    server = request.agent('http://localhost:3000'),
    bluebird = require('bluebird'),
    helper = require('../../helper'),
    _ = require('lodash'),
    contentType = require('../../../../../web/js/util/http').CONTENT_TYPE,
    jwt = require('jsonwebtoken'),
    config = require('../../../../../server/config/config');

describe('POST /api/registration', function () {
    before(helper.clearDb);

    it('should create a registration', function (done) {

        /**
         * @param registration
         * @returns {bluebird.Promise}
         */
        var createRegistration = function (registration) {
            return new bluebird.Promise(function (resolve, reject) {
                server
                    .post('/api/registration')
                    .send(registration)
                    .set('Content-Type', contentType)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        res.body['$context'].should.be.equal('https://tools.ietf.org/html/rfc7519');
                        jwt.verify(res.body.token, config.get('public_key'), function (err, decoded) {
                            decoded.sub.should.be.equal(registration.email);
                            decoded.iss.should.be.equal('registration');
                            decoded.registered.should.be.equal(true);
                        });
                        resolve();
                    })
                ;
            });
        };

        bluebird.join(
            createRegistration({
                email: 'john.doe@example.com'
            }),
            createRegistration({
                email: 'jane.doe@example.com'
            })
        ).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
