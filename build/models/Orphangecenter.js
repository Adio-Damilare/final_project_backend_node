"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
class Orphanagecenter extends sequelize_1.Model {
}
exports.default = Orphanagecenter;
Orphanagecenter.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV1,
        primaryKey: true
    },
    center_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    no_orphanage: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lga: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    goal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    bank: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    account_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    acctNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: connection_1.sequelize
});
