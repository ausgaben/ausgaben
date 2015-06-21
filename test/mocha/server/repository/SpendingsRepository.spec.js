'use strict';

require('should');
var db = require('../../../../server/config/sequelize'),
    Repository = require('../../../../server/repository/SpendingsRepository'),
    bluebird = require('bluebird'),
    helper = require('../helper');

describe('SpendingsRepository', function () {
    before(helper.clearDb);

    var repository, month;

    before(function () {
        repository = new Repository(db);
    });

    it('should persist', function (done) {
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
        bluebird.join(repository.persist(spending1), repository.persist(spending2)).then(function() {
            spending1.id.should.be.greaterThan(0);
            spending2.id.should.be.greaterThan(0);
            done();
        });
    });
});
