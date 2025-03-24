import { Request, Response } from 'express';
import { createEvent, getEvents, getEventById } from '../services/event.service';

const EventMessageBus = require('../event-message-bus');

const rabbitmqUrl = 'amqp://guest:guest@rabbitmq:5672';
const messageBus = new EventMessageBus(rabbitmqUrl);
3
async function initializeMessageBus() {
    try {
        await messageBus.connect();
        console.log('RabbitMQ connected');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}

initializeMessageBus(); // Initialize message bus when the module loads

export const postEvent = async (req: Request, res: Response) => {
    try {
        const event = await createEvent(req.body);

        // Publish event to RabbitMQ
        await messageBus.publishEvent('event.created', event);

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

export const fetchEvents = async (req: Request, res: Response) => {
    try {
        const events = await getEvents();
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events' });
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
        res.status(500).json({ message: 'Error fetching event' });
    }
};

process.on('SIGINT', async () => {
    console.log('Closing message bus connection...');
    await messageBus.close();
    process.exit(0);
});