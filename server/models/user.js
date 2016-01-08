'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            validate: {
                isEmail: true
            }
        }
    }, {
        tableName: 'User',
        repository: 'UsersRepository'
    });
};
