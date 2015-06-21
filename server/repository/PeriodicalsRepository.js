'use strict';

var _ = require('lodash'),
    bluebird = require('bluebird');

var PeriodicalsRepository = function (db) {
    this.db = db;
};

PeriodicalsRepository.prototype.persist = function(entity)
{
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

/**
 * @returns {bluebird.Promise}
 */
PeriodicalsRepository.prototype.findByMonth = function (month) {
    var db = this.db;
    return new bluebird.Promise(function (resolve, reject) {
        bluebird.try(function() {
            var monthKey = 'enabledIn' + _.padLeft(month.getMonth() + 1, 2, 0);
            var where = {starts: {lte: month}};
            where[monthKey] = true;
            db.models['Periodical']
                .findAll({where: where}).then(resolve);
        })
        .catch(function (err) {
            reject(err);
        });
    });
};

module.exports = PeriodicalsRepository;
