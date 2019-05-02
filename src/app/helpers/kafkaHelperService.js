const kafka = require('kafka-node');
const _ = require('lodash');
const envHelper = require('./environmentVariablesHelper');

const client = new kafka.KafkaClient({
  kafkaHost: envHelper.KAFKA_HOST,
  maxAsyncRequests: 100
});

const producer = new kafka.HighLevelProducer(client);
producer.on('ready', function () {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', function (error) {
  console.error("Errored at kafka", error)
});

const KafkaService = {

  // send data to kafka
  sendRecord: (data, kafkaTopic, callback = () => {
  }) => {

    if (_.isEmpty(data)) {
      return callback(new Error('Data must be provided.'))
    }

    const record = [
      {
        topic: kafkaTopic,
        messages: data
      }
    ];
    // Send record to Kafka
    producer.send(record, callback)
  }
};

module.exports = KafkaService;
