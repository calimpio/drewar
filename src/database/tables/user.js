const { DataTypes } = require("sequelize");

module.exports = {
    Users: {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(11),
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
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