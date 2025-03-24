import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { EventAttributes } from '../types/event.types';

class Event extends Model<EventAttributes> implements EventAttributes {
    public id!: number;
    public type!: string;
    public payload!: string;
    public timestamp!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payload: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'events',
    }
);

export default Event;