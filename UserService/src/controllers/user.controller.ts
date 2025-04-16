import { Request, Response } from 'express';
import { createUser, getUsers, getUserById } from '../services/user.service';

const UserMessageBus = require('../user-message-bus');

const rabbitmqUrl = 'amqp://guest:guest@rabbitmq:5672';
const messageBus = new UserMessageBus(rabbitmqUrl);
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

export const postUser = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);

        // Publish user to RabbitMQ
        await messageBus.publishUser('user.created', user);

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const fetchUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const fetchUserById = async (req: Request, res: Response) => {
    try {
        const user = await getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

process.on('SIGINT', async () => {
    console.log('Closing message bus connection...');
    await messageBus.close();
    process.exit(0);
});