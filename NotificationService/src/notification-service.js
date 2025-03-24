const NotificationMessageConsumer = require('./notification-message-consumer');

const rabbitmqUrl = 'amqp://guest:guest@rabbitmq:5672';
const messageConsumer = new NotificationMessageConsumer(rabbitmqUrl);

async function startNotificationService() {
    try {
        await messageConsumer.connect();

        process.on('SIGINT', async () => {
            console.log('Closing message bus connection...');
            await messageConsumer.close();
            process.exit(0);
        });
    } catch (error) {
        console.error('Failed to start notification service:', error);
        process.exit(1);
    }
}

startNotificationService();