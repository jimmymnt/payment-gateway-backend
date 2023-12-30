const amqp = require('amqplib');
const configs = require('./config.js');

class BaseRabbitMQ {
  channel;
  connection;

  async createChannel() {
    this.connection = await amqp.connect(configs.url);

    this.channel = await this.connection.createChannel();
  }

  async makeSureConnected() {
    if (!this.channel) {
      await this.createChannel();
    }
  }

  declare() {
    this.connection.close();
    process.exit(1);
  }
}

module.exports = BaseRabbitMQ;
