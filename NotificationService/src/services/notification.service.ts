import Notification from '../models/notification.model';
import { NotificationAttributes } from '../types/notification.types';

export const createNotification = async (notificationData: NotificationAttributes): Promise<Notification> => {
    return Notification.create(notificationData);
};

export const getNotification = async (): Promise<Notification[]> => {
    return Notification.findAll();
};

export const getNotificationById = async (id: number): Promise<Notification | null> => {
    return Notification.findByPk(id);
};