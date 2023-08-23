"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const mysql2_1 = __importDefault(require("mysql2"));
exports.sequelize = new sequelize_1.Sequelize(config_1.database_config.DATABASENAME, config_1.database_config.USER, config_1.database_config.PASSWORD, {
    host: config_1.database_config.HOST,
    dialect: config_1.database_config.DIALECT,
    logging: false,
    dialectModule: mysql2_1.default
});
