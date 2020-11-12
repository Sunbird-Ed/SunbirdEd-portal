import { NetworkQueue } from './networkQueue';
import * as path from 'path';
const chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox();
const expect = chai.expect;
import {queueListData, errorEvent} from './networkQueue.spec.data';

describe('NetworkQueue', async () => {
  let networkQueue;
  process.env.DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', '..', 'test_data');
  before(async () => {
    networkQueue = new NetworkQueue();
  });
  it('should call start method when internet is available', async () => {
    networkQueue.queueInProgress = false;
    spy.on(networkQueue.deviceSDK, 'getToken', data => Promise.resolve("api_key"));
    spy.on(networkQueue.networkSDK, 'isInternetAvailable', data => Promise.resolve(true));
    spy.on(networkQueue, 'getByQuery', data => Promise.resolve([{id: '123', data: {}}]));
    let execute = spy.on(networkQueue, 'execute');
    const data = await networkQueue.start();
    expect(execute).to.have.been.called();
  });
  it('should call add method', async () => {
    spy.on(networkQueue, 'enQueue', data => Promise.resolve('123'));
    let start = spy.on(networkQueue, 'start');
    const data = await networkQueue.add({});
    expect(data).to.be.equal('123');
    expect(start).to.have.been.called();
  });
  it('should call start method when internet is not available execute method should not get called', async () => {
    networkQueue.queueInProgress = false;
    spy.on(networkQueue.networkSDK, 'isInternetAvailable', data => Promise.resolve(false));
    spy.on(networkQueue, 'getByQuery', data => Promise.resolve([{id: '123', data: {}}]));
    let execute = spy.on(networkQueue, 'execute');
    await networkQueue.start();
    expect(execute).to.not.have.been.called();
  });
  it('call start method and get queue list data with length 3', async () => {
    networkQueue.running = 0;
    networkQueue.concurrency = 5;
    spy.on(networkQueue, 'getByQuery', data => Promise.resolve(queueListData));
    spy.on(networkQueue.networkSDK, 'isInternetAvailable', data => Promise.resolve(true));
    let makeHTTPCall = spy.on(networkQueue, 'makeHTTPCall', data => Promise.resolve({data:{responseCode: 'success'}}));
    await networkQueue.start();
    expect(makeHTTPCall).to.have.been.called.exactly(3);
  });
  it('when queue is in progress, execute method should not get called', async () => {
    networkQueue.queueInProgress = true;
    spy.on(networkQueue.networkSDK, 'isInternetAvailable', data => Promise.resolve(true));
    spy.on(networkQueue, 'getByQuery', data => Promise.resolve([{id: '123', data: {}}]));
    let execute = spy.on(networkQueue, 'execute');
    await networkQueue.start();
    expect(execute).to.not.have.been.called();
  });
  it('when queueData is empty, execute method should not get called', async () => {
    networkQueue.queueInProgress = false;
    spy.on(networkQueue.networkSDK, 'isInternetAvailable', data => Promise.resolve(true));
    spy.on(networkQueue, 'getByQuery', data => Promise.resolve([]));
    let execute = spy.on(networkQueue, 'execute');
    await networkQueue.start();
    expect(execute).to.not.have.been.called();
  });
  it('call execute logTelemetryError', async () => {
    const telemetryInstance = spy.on(networkQueue.telemetryInstance, 'error', data => Promise.resolve({}));
    networkQueue.logTelemetryError({stack: 'stack'});
    expect(telemetryInstance).to.have.been.called.with(errorEvent);
  });
  afterEach(async () => {
    spy.restore();
  })

})
