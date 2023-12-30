import { connect } from 'amqplib';
import configs from './config.js';

export default class BaseRabbitMQ {
  channel;
  connection;

  async createChannel() {
    this.connection = await connect(configs.url);

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
