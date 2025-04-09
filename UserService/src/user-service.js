const express = require('express');

const UserMessageBus = require('./user-message-bus');

const app = express();
app.use(express.json());

const rabbitmqUrl = 'amqp://guest:guest@rabbitmq:5672';
const messageBus = new UserMessageBus(rabbitmqUrl);

async function startService() {
    try {
        await messageBus.connect();

        app.post('/events', async (req, res) => {
            const { eventName, userData } = req.body;

            try {
                await messageBus.publishEvent(eventName, userData);
                res.status(202).send('Event published');
            } catch (publishError) {
                console.error('Error publishing event:', publishError);
                res.status(500).send('Error publishing event');
            }
        });

        const port = 3010;
        app.listen(port, () => {
            console.log(`Event service listening on port ${port}`);
        });

        process.on('SIGINT', async () => {
            console.log('Closing message bus connection...');
            await messageBus.close();
            process.exit(0);
        });

    } catch (connectError) {
        console.error('Failed to start service:', connectError);
        process.exit(1);
    }
}

startService();