import { Request, Response } from 'express';
import { createNotification, getNotification, getNotificationById } from '../services/notification.service';
import { broadcastEvent } from '../services/SSE.service';

export const postNotification = async (req: Request, res: Response) => {
    try {
        const notification = await createNotification(req.body);

        broadcastEvent(notification);

        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};

export const fetchNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await getNotification();
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

export const fetchNotificationById = async (req: Request, res: Response) => {
    try {
        const notification = await getNotificationById(parseInt(req.params.id));
        if (notification) {
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notification' });
    }
};