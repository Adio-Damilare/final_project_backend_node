"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
const Orphangecenter_1 = __importDefault(require("./Orphangecenter"));
const Email_1 = require("../controller/Email");
const month = Email_1.Months[new Date().getMonth()];
class Pledge extends sequelize_1.Model {
}
exports.default = Pledge;
Pledge.init({
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
        allowNull: true
    },
    donate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    day: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true
    },
    month: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: month
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: connection_1.sequelize
});
Orphangecenter_1.default.hasMany(Pledge, {
    foreignKey: "orphan_id"
});
Pledge.belongsTo(Orphangecenter_1.default);
