const amqp = require('amqplib');

import { createNotification } from '../src/services/notification.service';

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

    async handleMessage(message) {
        const { eventName, eventData } = message;

        switch (eventName) {
            case 'event.created':
                try {
                    const notification = await createNotification(eventData);

                    broadcastEvent(notification);
                } catch (error) {
                    console.error(error);
                }

                break;
            case 'event.updated':
                console.log(`Notification: Event updated - ${eventData.name}`);
                break;
            case 'user.registered':
                console.log(`Notification: New user registered - ${eventData.userId}`);
                break;
            default:
                console.log(`Received unknown event: ${eventName}`);
                break;
        }
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            console.log('RabbitMQ connection closed');
        }
    }
}

module.exports = NotificationMessageConsumer