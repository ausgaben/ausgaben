'use strict';

var AccountsRepository = function (db) {
    this.db = db;
};

AccountsRepository.prototype.persist = function (entity) {
    var db = this.db;
    return db.transaction(function (t) {
        return entity.save({
            transaction: t
        });
    });
};

module.exports = AccountsRepository;
