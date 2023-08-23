import {Model, DataTypes} from 'sequelize';
import {sequelize} from '../connection';
import Orphanagecenter from './Orphangecenter';

export default class Activities extends Model {}
Activities.init(
    {
        unique_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        view: {
            type: DataTypes.STRING,
            allowNull: true
        },
        like: {
            type: DataTypes.STRING,
            allowNull: true
        },
    
        desc:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize
    }
);

Orphanagecenter.hasMany(Activities,{
    foreignKey:"orphan_id"});
Activities.belongsTo(Orphanagecenter);
