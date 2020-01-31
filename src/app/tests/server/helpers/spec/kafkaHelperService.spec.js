const mock    = require('mock-require');
const events  = require('events').EventEmitter;
const sinon   = require('sinon');
const chai    = require('chai');
const expect  = chai.expect;

const mockEnv = {
  sunbird_processing_kafka_host: 'http://localhost:2181'
};

mock('../../../../helpers/environmentVariablesHelper', mockEnv);

class Kafka {
  constructor() { }
}
class KafkaClient {
  constructor() { }
}
class Producer extends events { }

class HighLevelProducer extends Producer { }

mock('kafka-node', {
  Kafka,
  KafkaClient,
  Producer,
  HighLevelProducer
});

const kafkaHelperService = require('../../../../helpers/kafkaHelperService');

describe('Kafka Helper Service Test Cases', () => {

  after(() => {
    mock.stopAll();
  })

  it('should return error message DATA_MISSING', (done) => {
    kafkaHelperService.sendMessage(null, null, (error, res) => {
      expect(error.message).to.eql('DATA_MISSING.');
      done();
    });
  });

  it('should return error message KAFKA_TOPIC_MISSING', (done) => {
    kafkaHelperService.sendMessage('data', null, (error, res) => {
      expect(error.message).to.eql('KAFKA_TOPIC_MISSING.');
      done();
    });
  });

  it('should return error message KAFKA_NOT_INITIALIZED', (done) => {
    sinon.stub(mockEnv, 'sunbird_processing_kafka_host').value(null)
    kafkaHelperService.sendMessage('data', null, (error, res) => {
      expect(error.message).to.eql('KAFKA_NOT_INITIALIZED.');
      done();
    });
  });

});
