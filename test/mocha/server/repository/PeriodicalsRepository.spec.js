'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/PeriodicalsRepository'),
    AccountsRepository = require('../../../../server/repository/AccountsRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('PeriodicalsRepository', function () {
    before(helper.clearDb);

    var repository, accountsRepository;

    before(function () {
        repository = new Repository(db);
        accountsRepository = new AccountsRepository(db);
    });

    it('should persist', function (done) {
        var account = db.models['Account'].build({
            name: 'Account'
        });
        var periodical1 = db.models['Periodical'].build({
            type: db.models.Spending.type.INCOME,
            category: 'Salary',
            title: 'Tanja\'s Salary',
            amount: 165432,
            starts: '2015-01-01'
        });
        var periodical2 = db.models['Periodical'].build({
            type: db.models.Spending.type.INCOME,
            category: 'Salary',
            title: 'Markus\' Salary',
            amount: 123456,
            starts: '2015-01-02'
        });

        accountsRepository.persist(account)
            .then(function () {
                periodical1.setAccount(account, {save: false});
                periodical2.setAccount(account, {save: false});
                return bluebird.join(repository.persist(periodical1), repository.persist(periodical2));
            })
            .then(function () {
                periodical1.id.should.be.greaterThan(0);
                periodical2.id.should.be.greaterThan(0);
                done();
            });
    });

    it('should find periodicals by month', function (done) {
        repository.findByMonth(new Date('2015-01-02')).then(function (periodicals) {
            periodicals.length.should.be.equal(2);
            done();
        });
    });
});
