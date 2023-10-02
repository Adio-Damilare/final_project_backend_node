"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database_config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.database_config = {
    HOST: process.env.DATABASE_HOST || '',
    USER: process.env.DATABASE_USER || '',
    PASSWORD: process.env.DATABASE_PASSWORD || '',
    DATABASENAME: process.env.DATABASE_NAME || '',
    DIALECT: process.env.DATABASE_DIALECT || '',
};
