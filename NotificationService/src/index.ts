import { app, connectToDatabase } from './app';
import dotenv from 'dotenv';

require("./notification-service")

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

startServer();