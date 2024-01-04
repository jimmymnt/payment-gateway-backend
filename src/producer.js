const amqp = require('amqplib');
const {url, exchangeName} = require("./config.js");
const BaseRabbitMQ = require('./rabbitmq.js');

// Step 1: Connect to the RabbitMQ server.
// Step 2: Create a new Channel on that connection.
// Step 3: Create the Exchange
// Step 4: Publish the message to the exchange with a routingKey
class Producer extends BaseRabbitMQ {

  async publishMessage(routingKey, message) {
    await this.makeSureConnected();

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

module.exports = Producer;
