import express, { Express } from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/user.routes';
import { connectToDatabase } from './database';

dotenv.config();

const app: Express = express();
app.use(express.json()); // Parse JSON requests
app.use('/users', eventRoutes);

export { app, connectToDatabase };