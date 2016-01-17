'use strict';

var TYPE_INCOME = 'income',
    TYPE_SPENDING = 'spending',
    TYPE_SAVING = 'saving';

module.exports = function (sequelize, dataTypes) {
    return sequelize.define('Spending', {
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
        booked: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        bookedAt: {
            type: dataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    }, {
        tableName: 'Spending',
        associate: function (models) {
            var thisModel = models[this.name.singular];
            thisModel.belongsTo(models.Periodical, {
                foreignKey: {
                    allowNull: true
                }
            });
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
        classMethods: {
            type: {
                INCOME: TYPE_INCOME,
                SPENDING: TYPE_SPENDING,
                SAVING: TYPE_SAVING
            }
        },
        repository: 'SpendingsRepository'
    });
};
