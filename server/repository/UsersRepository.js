'use strict';

var UsersRepository = function (db) {
    this.db = db;
};

UsersRepository.prototype.persist = function (entity) {
    var db = this.db;
    return db.transaction(function (t) {
        return entity.save({
            transaction: t
        });
    });
};

module.exports = UsersRepository;
