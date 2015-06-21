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
            db.models['Periodical'].findAll({where: {starts: {gte: month}}}).then(resolve);
        })
        .catch(function (err) {
            reject(err);
        });
    });
};

module.exports = PeriodicalsRepository;
