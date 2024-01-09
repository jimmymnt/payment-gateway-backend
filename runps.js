const Producer = require('./src/producer');

const args = process.argv.slice(2);
const a = new Producer();
const routingKey = args[0];
const message = args[1] || 'Fixed';
a.publishMessage(routingKey, message);