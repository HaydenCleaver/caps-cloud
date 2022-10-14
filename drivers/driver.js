'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const Chance = require('chance');

const chance = new Chance();

const producer = Producer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/605337152585/vendorQueue',
  region: 'us-west-2',
});

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/605337152585/packages.fifo',
  handleMessage: order,
});

async function order (data){
  let message = '';
  let body = JSON.parse(data.Body);
  message = body.Message;
  console.log(message);

  let stringifiedMessage = JSON.stringify(message);

  let payload = {
    id: chance.guid(),
    body: stringifiedMessage,
    MessageGroupId: 'temp',
    deduplicationId: chance.guid(),
  };

  try {
    let response = await producer.send(payload);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
