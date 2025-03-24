import express, { Express } from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/notification.routes';
import communicationRoutes from '../src/routes/SSE.routes';
import { connectToDatabase } from './database';

dotenv.config();

const app: Express = express();
app.use(express.json()); // Parse JSON requests
app.use('/notifications', eventRoutes);
app.use('/', communicationRoutes)

export { app, connectToDatabase };