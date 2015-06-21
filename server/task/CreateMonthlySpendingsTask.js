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
    return new bluebird.Promise(function (resolve, reject) {
        // console.log('Creating spendings for month: ' + month.getFullYear() + '-' + _.padLeft((month.getMonth() + 1), 2, 0));
        // Find the periodicals for the given month
        periodicalsRepository
        .findByMonth(month)
        .then(function (periodicals) {
            bluebird.try(function() {
                var spendings = [];
                _.map(periodicals, function (periodical) {
                    spendings.push(spendingsRepository.persist(spendingsRepository.spendingFromPeriodical(periodical)));
                });
                bluebird.Promise.all(spendings).then(function () {
                    resolve(spendings);
                })
            })
            .catch(function(err) {
                reject(err);
            });
        });
    });
};

module.exports = CreateMonthlySpendingsTask;
