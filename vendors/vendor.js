'use strict';

const { Consumer } = require('sqs-consumer');
const Chance = require('chance');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

const chance = new Chance();
const SNS = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:605337152585:packagePickup';

setInterval(() => {
  const message = {
    orderId: chance.guid(),
    customer: chance.name(),
    vendorId: 'queueARN goes here',
  };
  const payload = {
    Message: JSON.stringify(message),
    TopicArn: topic,
  };

  SNS.publish(payload).promise()
    .then(order => console.log(order))
    .catch(err => console.error(err.message));
}, 10000);


