'use strict';

var _ = require('lodash'),
    bluebird = require('bluebird');

var CreateMonthlySpendingsTask = function (periodicalsRepository, spendingsRepository) {
    this.periodicalsRepository = periodicalsRepository;
    this.spendingsRepository = spendingsRepository;
};

/**
 * @returns {bluebird.Promise}
 */
CreateMonthlySpendingsTask.prototype.execute = function (month) {
    var periodicalsRepository = this.periodicalsRepository;
    var spendingsRepository = this.spendingsRepository;
    // Find the periodicals for the given month
    return periodicalsRepository
        .findByMonth(month)
        .then(function (periodicals) {
            return bluebird.map(periodicals, function (periodical) {
                var p = {
                    type: periodical.type,
                    category: periodical.category,
                    title: periodical.title,
                    amount: periodical.amount,
                    bookedAt: month,
                    booked: false
                };
                return spendingsRepository.persist(spendingsRepository.spendingFromPeriodical(p));
            });
        });
};

module.exports = CreateMonthlySpendingsTask;
