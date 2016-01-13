'use strict';

module.exports = function (sequelize, dataTypes) {
    var fields = {
        name: {
            type: dataTypes.STRING(255),
            allowNull: false
        }
    };
    return sequelize.define('Account',
        fields,
        {
            tableName: 'Account',
            associate: function (models) {
                var thisModel = models[this.name.singular];
                thisModel.belongsToMany(models.User, {through: 'UserAccounts'});
            },
            repository: 'AccountsRepository'
        });
};
