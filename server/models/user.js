'use strict';

module.exports = function (sequelize, dataTypes) {
    return sequelize.define('User', {
        email: {
            type: dataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    }, {
        tableName: 'User',
        associate: function (models) {
            var thisModel = models[this.name.singular];
            thisModel.belongsToMany(models.Account, {through: 'UserAccounts'});
        },
        repository: 'UsersRepository'
    });
};
