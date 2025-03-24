import { Request, Response } from 'express';
import { createEvent, getEvents, getEventById } from '../services/notification.service';
import { broadcastEvent } from '../services/SSE.service';

export const postEvent = async (req: Request, res: Response) => {
    try {
        const event = await createEvent(req.body);
        
        broadcastEvent(event);
    
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};

export const fetchEvents = async (req: Request, res: Response) => {
    try {
        const events = await getEvents();
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

export const fetchEventById = async (req: Request, res: Response) => {
    try {
        const event = await getEventById(parseInt(req.params.id));
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notification' });
    }
};