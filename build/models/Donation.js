"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
const Orphangecenter_1 = __importDefault(require("./Orphangecenter"));
class Donation extends sequelize_1.Model {
}
exports.default = Donation;
Donation.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV1,
        primaryKey: true
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    donate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phoneno: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    throughPaystack: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    verify: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize: connection_1.sequelize
});
Orphangecenter_1.default.hasMany(Donation, {
    foreignKey: "orphan_id"
});
Donation.belongsTo(Orphangecenter_1.default);
