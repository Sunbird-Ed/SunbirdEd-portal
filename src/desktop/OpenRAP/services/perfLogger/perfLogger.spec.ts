const path = require('path');
process.env.DATABASE_PATH = path.join(__dirname, '..','..', 'test_data');
import { PerfLogger } from './index';
import * as _ from "lodash";
import { perfLogDataSet1, INITIAL_TRIGGER, DAY_IN_MILLISECONDS, MONTH_IN_MILLISECONDS } from './perfLogger.spec.data';
const sinon = require('sinon'), chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox(), expect = chai.expect;

const mockDataBaseSDK = {
  data: [],
  bulkDocs: (db_name, data) => {
    this.data = _.sortBy(data, ['createdOn']);
    return Promise.resolve();
  },
  find: (db_name, query) => {
    const matchedRows = [];
    for(let log of this.data){
      // console.log('mockDataBaseSDK.find loop', query.selector.createdOn['$gte'], log.createdOn, query.selector.createdOn['$lte'], matchedRows.length);
      if(query.selector.createdOn['$gte'] <= log.createdOn && query.selector.createdOn['$lte'] >= log.createdOn){
        matchedRows.push(log);
      }
      if(query.limit === matchedRows.length){
        break;
      }
    }
    return Promise.resolve({docs: matchedRows});
  }
}
describe('PerfLogger', async () => {
  let perfLogger;
  let clock;
  before(async () => {
    process.env.APP_BASE_URL = 'https://www.sunbird.org/';
    perfLogger = new PerfLogger();
    clock = sinon.useFakeTimers();
  });
  afterEach(async () => {
    clock.restore();
    spy.restore();
  })
  it(`should subscribe to timer on initialize and handleTimerEvent should be triggered after passed
        initial trigger value and every 24 hours`, () => {
    const handleTimerEvent = spy.on(perfLogger, 'handleTimerEvent', () => undefined);
    perfLogger.initialize(INITIAL_TRIGGER, DAY_IN_MILLISECONDS);
    clock.tick(INITIAL_TRIGGER + 1);
    expect(handleTimerEvent).to.have.been.called();
    expect(handleTimerEvent).to.have.been.called.once;
    expect(handleTimerEvent).to.have.been.called.with(0);
    clock.tick(DAY_IN_MILLISECONDS + 1);
    expect(handleTimerEvent).to.have.been.called.twice;
    expect(handleTimerEvent).to.have.been.called.with(1);
  });
  it(`should return asyncIterator that gives all logs within given time period without duplication or missing rows`, async () => {
    await mockDataBaseSDK.bulkDocs('perf', perfLogDataSet1.logs);
    const dataBaseSDKFindSyp = spy.on(perfLogger.dbSDK, 'find', mockDataBaseSDK.find.bind(mockDataBaseSDK));
    const lastProcessedDate = perfLogger.getStartAndEndEpochTime(perfLogDataSet1.lastSyncDate);
    const endDate = perfLogger.getStartAndEndEpochTime(perfLogDataSet1.currentDate);
    const perfLogsIterator = perfLogger.getUnProcessedLogsIterator({startTime: lastProcessedDate.endTime + 1, endTime: endDate.startTime - 1}, 2);
    const logs = [];
    for await (const log of perfLogsIterator) {
      logs.push(log);
    }
    expect(logs).to.be.deep.equal(_.sortBy(perfLogDataSet1.logs, ['createdOn']));
  });

});
