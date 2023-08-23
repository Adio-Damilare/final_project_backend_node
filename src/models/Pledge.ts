import {Model, DataTypes} from 'sequelize';
import {sequelize} from '../connection';
import Orphanagecenter from './Orphangecenter';
import { Months } from '../controller/Email';

const month=Months[new Date().getMonth()]
export default class Pledge extends Model {}
Pledge.init(
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
            allowNull: true
        },
        donate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        day: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        month:{
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue:month
        },
        email:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize
    }
);

Orphanagecenter.hasMany(Pledge,{
    foreignKey:"orphan_id"});
Pledge.belongsTo(Orphanagecenter);
