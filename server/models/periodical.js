'use strict';

var _ = require('lodash'),
    TYPE_INCOME = 'income',
    TYPE_SPENDING = 'spending',
    TYPE_SAVING = 'saving';

module.exports = function (sequelize, DataTypes) {

    var fields = {
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
        estimate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        starts: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    };
    for (var i = 1; i <= 12; i++) {
        fields['enabledIn' + _.padLeft(i, 2, 0)] = {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        };
    }

    return sequelize.define('Periodical',
        fields,
        {
            tableName: 'Periodical',
            classMethods: {
                type: {
                    INCOME: TYPE_INCOME,
                    SPENDING: TYPE_SPENDING,
                    SAVING: TYPE_SAVING
                }
            }
        });
};
