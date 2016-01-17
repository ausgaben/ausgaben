'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/UsersRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('UsersRepository', function () {
    before(helper.clearDb);

    var repository;

    before(function () {
        repository = new Repository(db);
    });

    it('should persist', function (done) {
        var user1 = db.models['User'].build({
            email: 'john.doe@example.com'
        });
        var user2 = db.models['User'].build({
            email: 'jane.doe@example.com'
        });
        bluebird.join(repository.persist(user1), repository.persist(user2)).then(function () {
            user1.get('email').should.equal('john.doe@example.com');
            user2.get('email').should.equal('jane.doe@example.com');
            done();
        });
    });
});
