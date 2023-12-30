import { connect } from 'amqplib';
import configs from '../config.js';

const sender = async () => {
  // 1. Connect to RabbitMQ server
  const conn = await connect(configs.url);

  // 2. Create Channel
  const channel = await conn.createChannel();

  // 3. Create Exchange with exchange-type is TOPIC
  // In this case we're going to use `durable` as `true` which means the data will be stored on Disk
  // Not in-memory
  const exchange = configs.url;
  await channel.assertExchange(exchange, 'topic', {
    durable: true,
  });

  const args = process.argv.slice(2);
  const toptic = args[0];
  const message = args[1] || 'Fixed';

  // 4. Publish msg
  const products = [
    {
      id: 12,
      price: 1000,
    },
    {
      id: 13,
      price: 5000,
    },
    {
      id: 14,
      price: 2000,
    },
  ]

  channel.publish(
    exchange,
    toptic,
    Buffer.from(JSON.stringify(products)),
    {
      persistent: true,
    }
  );

  console.log(`[x] TOPIC::: ${toptic}`);
  console.log(`[x] MESSAGE::: ${message}`);

  // 5. Close connection
  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 2000);
}

sender();
