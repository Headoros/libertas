import User from '../models/user.model';
import { UserAttributes } from '../types/user.types';

export const createUser = async (eventData: UserAttributes): Promise<User> => {
    return User.create(eventData);
};

export const getUsers = async (): Promise<User[]> => {
    return User.findAll();
};

export const getUserById = async (id: number): Promise<User | null> => {
    return User.findByPk(id);
};