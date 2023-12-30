import { connect } from 'amqplib';
import configs from './config.js';
import BaseRabbitMQ from './rabbitmq.js';

// Step 1: Connect to the RabbitMQ server.
// Step 2: Create a new Channel on that connection.
// Step 3: Create the Exchange
// Step 4: Publish the message to the exchange with a routingKey
export default class Producer extends BaseRabbitMQ {

  async publishMessage(routingKey, message) {
    await this.makeSureConnected();

    const exchangeName = configs.exchangeName;
    await this.channel.assertExchange(exchangeName, 'topic', {
      durable: true,
    });

    this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );

    console.log(`[x] TOPIC::: ${routingKey}`);
    console.log(`[x] MESSAGE::: ${message}`);

    setTimeout(() => this.declare(), 2000);
  }
}
