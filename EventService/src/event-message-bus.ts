import { ChannelModel, Channel, connect } from 'amqplib';

class EventMessageBus {
    private rabbitmqUrl: string;
    private connection: ChannelModel | null;
    private channel: Channel | null;
    private exchangeName: string;

    constructor(rabbitmqUrl: string) {
        this.rabbitmqUrl = rabbitmqUrl;
        this.connection = null;
        this.channel = null;
        this.exchangeName = 'events';
    }

    async connect(): Promise<void> {
        try {
            this.connection = await connect(this.rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async publishEvent(eventName: string, eventData: any): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized. Call connect() first.');
        }

        const message = JSON.stringify({ eventName, eventData });
        this.channel.publish(this.exchangeName, '', Buffer.from(message));
        console.log(`Published event: ${eventName}`);
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            this.channel = null;
            console.log('RabbitMQ connection closed');
        }
    }
}

export = EventMessageBus;