'use strict';

var TYPE_INCOME = 'income',
    TYPE_SPENDING = 'spending',
    TYPE_SAVING = 'saving';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Spending', {
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
            isIn: [[TYPE_INCOME, TYPE_SPENDING, TYPE_SAVING]]
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        booked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        bookedAt: {
            type: DataTypes.DATE,
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
