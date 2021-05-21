import { Queue } from './queue';
import * as path from 'path';
const chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox();
const expect = chai.expect;

describe('Queue', async () => {
  let queue;
  before(async () => {
    queue = new Queue();
    process.env.DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', '..', 'test_data');
  });
  it('should call enQueue method', async () => {
    let insertDoc = spy.on(queue.dbSDK, 'insertDoc', data => Promise.resolve('123'));
    await queue.enQueue({});
    expect(insertDoc).to.have.been.called();
  });
  it('should call updateQueue method', async () => {
    let updateDoc = spy.on(queue.dbSDK, 'updateDoc', data => Promise.resolve('123'));
    await queue.updateQueue('123', {});
    expect(updateDoc).to.have.been.called();
  });
  it('should call deQueue method', async () => {
    let deQueue = spy.on(queue.dbSDK, 'delete', data => Promise.resolve('123'));
    await queue.deQueue('123');
    expect(deQueue).to.have.been.called();
  });
  it('should call length method', async () => {
    let list = spy.on(queue.dbSDK, 'list', data => Promise.resolve(1));
    await queue.length();
    expect(list).to.have.been.called();
  });
  it('should call getById method', async () => {
    let getDoc = spy.on(queue.dbSDK, 'getDoc', data => Promise.resolve('123'));
    await queue.getById('123');
    expect(getDoc).to.have.been.called();
  });
  it('should call getByQuery method', async () => {
    let find = spy.on(queue.dbSDK, 'find', data => Promise.resolve('123'));
    await queue.getByQuery({});
    expect(find).to.have.been.called();
  });
  afterEach(async () => {
    spy.restore();
  })

})
