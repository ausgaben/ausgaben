'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Spending', {
        description: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Spending'
    });
};
