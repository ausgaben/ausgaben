'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/AccountsRepository'),
    UsersRepository = require('../../../../server/repository/UsersRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('AccountsRepository', function () {
    before(helper.clearDb);

    var repository, usersRepository;

    before(function () {
        repository = new Repository(db);
        usersRepository = new UsersRepository(db);
    });

    it('should persist', function (done) {
        var user = db.models['User'].build({
            email: 'john.doe@example.com'
        });
        var account1 = db.models['Account'].build({
            name: 'Account 1'
        });
        var account2 = db.models['Account'].build({
            name: 'Account 2'
        });
        usersRepository.persist(user)
            .then(function () {
                account1.setCreator(user, {save: false});
                account2.setCreator(user, {save: false});
                return bluebird.join(
                    repository.persist(account1),
                    repository.persist(account2)
                );
            })
            .then(function () {
                account1.id.should.be.greaterThan(0);
                account2.id.should.be.greaterThan(0);
                done();
            });
    });
});
