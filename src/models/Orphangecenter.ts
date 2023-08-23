import {Model, DataTypes} from 'sequelize';
import {sequelize} from '../connection';

export default class Orphanagecenter extends Model {}
Orphanagecenter.init(
    {
        unique_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        center_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        no_orphanage: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lga: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        goal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bank: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        acctNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize
    }
);
