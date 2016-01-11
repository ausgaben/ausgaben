'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/AccountsRepository'),
    UserRepository = require('../../../../server/repository/UsersRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('AccountsRepository', function () {
    before(helper.clearDb);

    var repository, userRepository;

    before(function () {
        repository = new Repository(db);
        userRepository = new UserRepository(db);
    });

    it('should persist', function (done) {
        var account1, account2;
        userRepository
            .persist(db.models['User'].build({email: 'john.doe@example.com'}))
            .then(function (user) {
                account1 = db.models['Account'].build({
                    name: 'Account 1'
                });
                account2 = db.models['Account'].build({
                    name: 'Account 2'
                });
                account1.setUser(user, {save: false});
                account2.setUser(user, {save: false});
                return bluebird
                    .join(
                        repository.persist(account1),
                        repository.persist(account2)
                    );
            })
            .then(function () {
                account1.id.should.be.greaterThan(0);
                account2.id.should.be.greaterThan(0);
                done();
            })
        ;
    });
});
