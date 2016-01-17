'use strict';

var _ = require('lodash'),
    TYPE_INCOME = 'income',
    TYPE_SPENDING = 'spending',
    TYPE_SAVING = 'saving';

module.exports = function (sequelize, dataTypes) {

    var fields = {
        type: {
            type: dataTypes.STRING(255),
            allowNull: false,
            isIn: [[TYPE_INCOME, TYPE_SPENDING, TYPE_SAVING]]
        },
        category: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        title: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        amount: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        estimate: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        starts: {
            type: dataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    };
    for (var i = 1; i <= 12; i++) {
        fields['enabledIn' + _.padStart(i, 2, 0)] = {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        };
    }

    return sequelize.define('Periodical',
        fields,
        {
            tableName: 'Periodical',
            associate: function (models) {
                var thisModel = models[this.name.singular];
                thisModel.belongsTo(models.Account, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                thisModel.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    },
                    as: 'Creator'
                });
            },
            repository: 'PeriodicalsRepository'
        });
};
