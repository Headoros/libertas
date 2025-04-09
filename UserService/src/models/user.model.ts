import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { UserAttributes } from '../types/user.types';

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public oauth_provider!: string;
    public oauth_id!: string;
    public name!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        oauth_provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        oauth_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;