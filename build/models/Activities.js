"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
const Orphangecenter_1 = __importDefault(require("./Orphangecenter"));
class Activities extends sequelize_1.Model {
}
exports.default = Activities;
Activities.init({
    unique_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV1,
        primaryKey: true
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    view: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    like: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: connection_1.sequelize
});
Orphangecenter_1.default.hasMany(Activities, {
    foreignKey: "orphan_id"
});
Activities.belongsTo(Orphangecenter_1.default);
