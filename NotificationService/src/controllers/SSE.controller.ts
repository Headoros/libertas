import { Request, Response } from 'express';
import {
    addClient,
    removeClient
} from '../services/SSE.service';

export const handleSSEConnection = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    addClient(res);

    req.on('close', () => {
        removeClient(res);
        res.end();
    });

    res.write(`data: connected\n\n`);
};