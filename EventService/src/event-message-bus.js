const amqp = require('amqplib');

class EventMessageBus {
    constructor(rabbitmqUrl) {
        this.rabbitmqUrl = rabbitmqUrl;
        this.connection = null;
        this.channel = null;
        this.exchangeName = 'events';
    }

    async connect() {
        try {
            this.connection = await amqp.connect(this.rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async publishEvent(eventName, eventData) {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized. Call connect() first.');
        }

        const message = JSON.stringify({ eventName, eventData });
        this.channel.publish(this.exchangeName, '', Buffer.from(message));
        console.log(`Published event: ${eventName}`);
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            console.log('RabbitMQ connection closed');
        }
    }
}

module.exports = EventMessageBus;