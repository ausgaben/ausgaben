'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/AccountsRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('AccountsRepository', function () {
    before(helper.clearDb);

    var repository;

    before(function () {
        repository = new Repository(db);
    });

    it('should persist', function (done) {
        var account1 = db.models['Account'].build({
            name: 'Account 1'
        });
        var account2 = db.models['Account'].build({
            name: 'Account 2'
        });
        return bluebird
            .join(
                repository.persist(account1),
                repository.persist(account2)
            )
            .then(function () {
                account1.id.should.be.greaterThan(0);
                account2.id.should.be.greaterThan(0);
                done();
            })
            ;
    });
});
