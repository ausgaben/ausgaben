'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Spending', {
        description: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'Spending'
    });
};
