'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/SpendingsRepository'),
    AccountsRepository = require('../../../../server/repository/AccountsRepository'),
    UsersRepository = require('../../../../server/repository/UsersRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('SpendingsRepository', function () {
    before(helper.clearDb);

    var repository, accountsRepository, usersRepository;

    before(function () {
        repository = new Repository(db);
        accountsRepository = new AccountsRepository(db);
        usersRepository = new UsersRepository(db);
    });

    it('should persist', function (done) {
        var user = db.models['User'].build({
            email: 'john.doe@example.com'
        });
        var account = db.models['Account'].build({
            name: 'Account'
        });
        var spending1 = db.models['Spending'].build({
            type: db.models.Spending.type.INCOME,
            category: 'Salary',
            title: 'Tanja\'s Salary',
            amount: 165432,
            starts: '2015-01-01'
        });
        var spending2 = db.models['Spending'].build({
            type: db.models.Spending.type.INCOME,
            category: 'Salary',
            title: 'Markus\' Salary',
            amount: 123456,
            starts: '2015-01-02'
        });
        usersRepository.persist(user)
            .then(function () {
                account.setCreator(user, {save: false});
                spending1.setCreator(user, {save: false});
                spending2.setCreator(user, {save: false});
                return accountsRepository.persist(account);
            })

            .then(function () {
                spending1.setAccount(account, {save: false});
                spending2.setAccount(account, {save: false});
                return bluebird.join(repository.persist(spending1), repository.persist(spending2));
            })
            .then(function () {
                spending1.id.should.be.greaterThan(0);
                spending2.id.should.be.greaterThan(0);
                done();
            });
    });
});
