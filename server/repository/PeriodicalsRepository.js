'use strict';

var _ = require('lodash'),
    bluebird = require('bluebird');

var PeriodicalsRepository = function (db) {
    this.db = db;
};

PeriodicalsRepository.prototype.persist = function (entity) {
    var db = this.db;
    return db.transaction(function (t) {
        return entity.save({
            transaction: t
        });
    });
};

/**
 * @returns {bluebird.Promise}
 */
PeriodicalsRepository.prototype.findByMonth = function (month) {
    var db = this.db;
    var monthKey = 'enabledIn' + _.padLeft(month.getMonth() + 1, 2, 0);
    var where = {starts: {lte: month}};
    where[monthKey] = true;
    return db.models.Periodical.findAll({where: where});
};

module.exports = PeriodicalsRepository;
