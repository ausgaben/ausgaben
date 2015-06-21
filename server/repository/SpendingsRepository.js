'use strict';

var _ = require('lodash'),
    bluebird = require('bluebird');

var SpendingsRepository = function (db) {
    this.db = db;
};

SpendingsRepository.prototype.persist = function (entity) {
    var db = this.db;
    return new bluebird.Promise(function (resolve, reject) {
        bluebird.try(function () {
            return db.transaction(function (t) {
                return entity.save({
                    transaction: t
                });
            });
        }).then(function () {
            resolve(entity);
        }).catch(function (err) {
            reject(err);
        });
    });
};

SpendingsRepository.prototype.spendingFromPeriodical = function (periodical) {
    var spending = this.db.models['Spending'].build({
        type: periodical.type,
        category: periodical.category,
        title: periodical.title,
        amount: periodical.amount
    });
    spending.setPeriodical(periodical, {save: false});
    return spending;
};

module.exports = SpendingsRepository;
