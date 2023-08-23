import {Sequelize} from 'sequelize';
import {database_config} from '../config';
import mysql2 from 'mysql2'

export const sequelize = new Sequelize(database_config.DATABASENAME, database_config.USER, database_config.PASSWORD, {
    host: database_config.HOST,
    dialect: database_config.DIALECT,
    logging:false,
    dialectModule:mysql2
});
