'use strict';

require('should');

var db = require('../../../../server/config/sequelize'),
    Task = require('../../../../server/task/CreateMonthlySpendingsTask'),
    PeriodicalsRepository = require('../../../../server/repository/PeriodicalsRepository'),
    SpendingsRepository = require('../../../../server/repository/SpendingsRepository');

describe('CreateMonthlySpendingsTask', function () {
    var task;
    var simple = require('simple-mock');
    var mockPeriodicalsRepository, mockSpendingsRepository;

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

    after(function () {
        simple.restore();
    });

    it('should create spendings for the given month', function (done) {
        var periodicals = [periodical1, periodical2];
        mockPeriodicalsRepository = new PeriodicalsRepository();
        simple.mock(mockPeriodicalsRepository, 'findByMonth').resolveWith(periodicals);
        mockSpendingsRepository = new SpendingsRepository();
        simple.mock(mockSpendingsRepository, 'persist').resolveWith(null);
        simple.mock(mockSpendingsRepository, 'spendingFromPeriodical').returnWith({});
        var month = new Date();
        task = new Task(mockPeriodicalsRepository, mockSpendingsRepository);
        task.execute(month).then(function () {
            mockPeriodicalsRepository.findByMonth.callCount.should.be.equal(1);
            mockPeriodicalsRepository.findByMonth.lastCall.arg.should.be.equal(month);
            mockSpendingsRepository.persist.callCount.should.be.equal(periodicals.length);
            done();
        });
    });
});
