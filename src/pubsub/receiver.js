const amqp = require('amqplib');
const configs = require('../config.js');

const receiver = async () => {
  // 1. Connect to RabbitMQ server
  const conn = await amqp.connect(configs.url);

  // 2. Create Channel
  const channel = await conn.createChannel();

  // 3. Create Exchange
  const nameExchange = configs.exchangeName;
  await channel.assertExchange(nameExchange, 'topic', {
    durable: true,
  });

  // 4. Create Queue
  const routingKey = '';
  const { queue } = await channel.assertQueue(routingKey, {
    exclusive: true
  });
  console.log('Queue is:', queue);

  // 5. Binding
  const topics = process.argv.slice(2);
  console.log(topics);
  if (!topics.length) {
    process.exit(0);
  }
  console.log(`[x] waiting from queue:::${queue} :::topic:::${topics}`);
  topics.forEach(async topic => {
    await channel.bindQueue(queue, nameExchange, topic);
  });

  await channel.consume(queue, msg => {
    if (msg != null) {
      console.log(`[x] RoutingKey = ${msg.fields.routingKey}:::msg:::${msg.content.toString()}`);
    } else {
      console.log('[x] CONSUME CANCELED BY SERVER');
    }
  }, {
    noAck: true,
  });
}

receiver();
