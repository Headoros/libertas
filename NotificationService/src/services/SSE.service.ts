import { Response } from 'express';

const clients: Response[] = [];

export const addClient = (res: Response) => {
    clients.push(res);
};

export const removeClient = (res: Response) => {
    const index = clients.indexOf(res);
    if (index !== -1) {
        clients.splice(index, 1);
    }
};

export const broadcastEvent = (eventData: any) => {
    clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(eventData)}\n\n`);
    });
};