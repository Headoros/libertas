import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { NotificationAttributes } from '../types/notification.types';

class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
    public id!: number;
    public type!: string;
    public payload!: string;
    public timestamp!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init(
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
        tableName: 'notifications',
    }
);

export default Notification;