const amqp = require('amqplib');

const { broadcastEvent } = require('../src/services/SSE.service');

class NotificationMessageConsumer {
    constructor(rabbitmqUrl) {
        this.rabbitmqUrl = rabbitmqUrl;
        this.connection = null;
        this.channel = null;
        this.exchangeName = 'events';
        this.queueName = 'notification-queue';
    }

    async connect() {
        try {
            this.connection = await amqp.connect(this.rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            const q = await this.channel.assertQueue(this.queueName, { exclusive: false });
            await this.channel.bindQueue(q.queue, this.exchangeName, '');
            console.log('Connected to RabbitMQ and listening for events...');
            this.consumeMessages(q.queue);
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async consumeMessages(queue) {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized. Call connect() first.');
        }

        this.channel.consume(
            queue,
            (msg) => {
                if (msg) {
                    const message = JSON.parse(msg.content.toString());
                    this.handleMessage(message);
                    this.channel.ack(msg);
                }
            },
            { noAck: false }
        );
    }

    handleMessage(message) {
        const { eventName, eventData } = message;

        switch (eventName) {
            case 'event.created':
                console.log(`Notification: New event created - ${eventData.name}`);
                this.sendEventCreatedNotification(eventData);

                broadcastEvent(eventData);

                break;
            case 'event.updated':
                console.log(`Notification: Event updated - ${eventData.name}`);
                this.sendEventUpdatedNotification(eventData);
                break;
            case 'user.registered':
                console.log(`Notification: New user registered - ${eventData.userId}`);
                this.sendUserRegisteredNotification(eventData);
                break;
            default:
                console.log(`Received unknown event: ${eventName}`);
                break;
        }
    }

    sendEventCreatedNotification(eventData) {
        console.log(`Sending notification for event creation: ${eventData.name}`);
    }

    sendEventUpdatedNotification(eventData) {
        console.log(`Sending notification for event update: ${eventData.name}`);
    }

    sendUserRegisteredNotification(eventData) {
        console.log(`Sending notification for user registration: ${eventData.userId}`);
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            console.log('RabbitMQ connection closed');
        }
    }
}

module.exports = NotificationMessageConsumer