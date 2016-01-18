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

/**
 * @param {string} email
 * @returns {bluebird.Promise}
 */
UsersRepository.prototype.findByEmail = function (email) {
    var db = this.db;
    return db.models.User.find({where: {
        email: email
    }});
};

module.exports = UsersRepository;
