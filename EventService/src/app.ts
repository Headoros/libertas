import express, { Express } from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/event.routes';
import { connectToDatabase } from './database';

dotenv.config();

const app: Express = express();
app.use(express.json()); // Parse JSON requests
app.use('/events', eventRoutes);

export { app, connectToDatabase };