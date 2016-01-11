'use strict';

var _ = require('lodash');

module.exports = function (sequelize, DataTypes) {

    var fields = {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    };
    return sequelize.define('Account',
        fields,
        {
            tableName: 'Account',
            associate: function (models) {
                var thisModel = models[this.name.singular];
                thisModel.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            },
            repository: 'AccountRepository'
        });
};
