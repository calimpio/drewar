const { DataTypes } = require("sequelize");

module.exports = {
    Devices: {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(11),
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: false,
            defaultValue: DataTypes.NOW,
            type: DataTypes.DATE
        },
    }
}