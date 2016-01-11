'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        email: {
            type: DataTypes.STRING(255),
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
