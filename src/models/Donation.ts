import {Model, DataTypes} from 'sequelize';
import {sequelize} from '../connection';
import Orphanagecenter from './Orphangecenter';

export default class Donation extends Model {}
Donation.init(
    {
        unique_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        donate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phoneno: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        desc:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue:true,
        },
        throughPaystack:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        verify:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue:false,
        }
    },
    {
        sequelize
    }
);


Orphanagecenter.hasMany(Donation,{
    foreignKey:"orphan_id"});
Donation.belongsTo(Orphanagecenter);
