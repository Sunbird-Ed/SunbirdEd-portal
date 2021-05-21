import { Singleton } from "typescript-ioc";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import { DataBaseSDK } from "../../sdks/DataBaseSDK";
import SettingSDK from '../../sdks/SettingSDK';
import { IPerfLog } from './IPerfLog';
import { timer } from 'rxjs';
import { TelemetryInstance } from './../telemetry/telemetryInstance';
import { StandardLogger } from '../standardLogger/standardLogger';

const INITIAL_TRIGGER = 15 * 60 * 1000; // trigger first job after 15 min  
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // trigger jobs every 24 hours after first trigger
const MONTH_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000; // used in archive job to remove logs which are older than last 30 days
const LOG_QUERY_LIMIT = 1000;
const DB_NAME = 'perf_log';
const LAST_PERF_LOG_PROCEEDED_ON = 'LAST_PERF_LOG_PROCEEDED_ON';
const DEFAULT_LAST_SYNC_TIME = 1585282913052; // used when setting sdk return no data
const system = "DesktopApp";
const subsystem = "DesktopApp";

@Singleton
export class PerfLogger {

    @Inject private dbSDK: DataBaseSDK;
    @Inject private settingSDK: SettingSDK;
    @Inject private telemetryInstance: TelemetryInstance;
    @Inject private standardLog: StandardLogger;

    public initialize(initial_trigger = INITIAL_TRIGGER, scheduled_trigger =  DAY_IN_MILLISECONDS){
        timer(initial_trigger, scheduled_trigger).subscribe(this.handleTimerEvent.bind(this)); // triggers aggregate job initial after initial_trigger and every 24 hours after initial trigger
    }

    private async handleTimerEvent(triggerCount) {
        try {
            await this.aggregateLogs();
            await this.archiveOldLogs();
        } catch (error) {
            this.standardLog.error({ id: 'PERF_LOGGER_AGGREGATE_LOGS_FAILED', message: `aggregateLogs failed for count - ${triggerCount}`, error });
        }
    }

    private async aggregateLogs() {
    
        const lastProcessedDateInDB = await this.settingSDK.get(LAST_PERF_LOG_PROCEEDED_ON).catch(error => undefined);
        const lastProcessedDate = _.get(lastProcessedDateInDB, 'lastProcessedOn') ? this.getStartAndEndEpochTime(lastProcessedDateInDB.lastProcessedOn)
            : this.getStartAndEndEpochTime(DEFAULT_LAST_SYNC_TIME);
        const endDate = this.getStartAndEndEpochTime(); // gives current date start and end epoch time, today logs shouldn't be processed
        let aggregatedLog = {};
        let currentEndTime = this.getStartAndEndEpochTime(lastProcessedDate.endTime + 1).endTime;

        let perfLogsIterator = this.getUnProcessedLogsIterator({startTime: lastProcessedDate.endTime + 1, endTime: endDate.startTime - 1}, LOG_QUERY_LIMIT);

        for await (const log of perfLogsIterator) {
            if(log.createdOn > currentEndTime) {
                this.generateTelemetryMetrics(aggregatedLog, currentEndTime);
                aggregatedLog = {};
                currentEndTime = this.getStartAndEndEpochTime(log.createdOn).endTime;
            }
            if(!aggregatedLog[log.type]){
                aggregatedLog[log.type] = [];
            }
            aggregatedLog[log.type].push(log);
        }
        this.generateTelemetryMetrics(aggregatedLog, currentEndTime); // generate metrics for last day
        await this.updateLastSyncDate(currentEndTime); // update last processed time
    }

    private filterLogs(logs) {
        let apiLogs = _.uniqBy(_.filter(logs, item => item.type === 'API'), 'metaData.url');
        let otherLogs = _.filter(logs, item => item.type !== 'API');
        return _.orderBy([...apiLogs, ...otherLogs], 'createdOn');
    }

    private getUnProcessedLogsIterator({startTime, endTime}, limit){
        const that = this;
        const generatorFunction = async function* () {
            let lastProcessedContent: any = {};
            while(true) {
                let logs = await that.getLogsFromDB({startTime, endTime}, {limit});
                logs = that.filterLogs(logs);
                const lastProcessedContentIndex = _.findIndex(logs, { _id: lastProcessedContent._id});
                if (lastProcessedContentIndex !== -1) {
                    logs = logs.slice(lastProcessedContentIndex + 1); // slice off already processed data
                }
                if(!logs.length){
                    return; // terminates generator 
                }
                for (const log of logs) {
                    yield log;
                }
                lastProcessedContent = logs[logs.length - 1]; // used to remove already processed data
                startTime = lastProcessedContent.createdOn; // update start time with last fetched rows createdOn
            }
        }
        return {
            [Symbol.asyncIterator]: generatorFunction
        }
    }

    private async generateTelemetryMetrics(aggregatedLog, currentEndTime) {
        if(_.isEmpty(aggregatedLog)) {
            return;
        }
        const metrics = [];
        _.forIn(aggregatedLog, (value, key) => {
            const metricKey = _.upperFirst(_.camelCase(key));
            const metricsRaw = this.findMinMaxAvg(value.map(ele => ele.time));
            metrics.push({
                metric: `min${metricKey}Time`,
                value: metricsRaw.min
            })
            metrics.push({
                metric: `max${metricKey}Time`,
                value: metricsRaw.max
            })
            metrics.push({
                metric: `avg${metricKey}Time`,
                value: metricsRaw.avg
            })
            metrics.push({
                metric: `total${metricKey}S`,
                value: value.length
            })
        })
        metrics.push({
            metric: 'createdDate',
            value: currentEndTime
        })
        const telemetryEvent = {
            context: {
              env: 'DesktopApp',
            },
            edata: {
                system,
                subsystem,
                metrics
            },
        }
        this.telemetryInstance.metrics(telemetryEvent);
    }
    findMinMaxAvg(arr = []){
            let max = arr[0];
            let min = arr[0];
            let sum = 0;
           arr.forEach((value) => {
               if(value > max)
                 max = value;
               if(value < min)
                 min = value;
               sum +=value;
           })
           let avg = sum/arr.length;
          return {max,min,avg};
    }

    private async updateLastSyncDate(currentEndTime){
        await this.settingSDK.put(LAST_PERF_LOG_PROCEEDED_ON, {lastProcessedOn: currentEndTime}); // should be un-commented
    }

    private async getLogsFromDB<T>({startTime, endTime}: {startTime: number, endTime: number},
            {fields, limit}: { fields?: string[], limit?: number}): Promise<IPerfLog<T>[]> {
        const query = {
            selector: {
                createdOn: {
                    "$gte": startTime,
                    "$lte": endTime
                }
            },
            sort: ['createdOn']
        }
        if(limit){
            query['limit'] = limit;
        }
        if (fields) {
            query['fields'] = fields;
        }
        return this.dbSDK.find(DB_NAME, query).then(data => data.docs);
    }

    private getStartAndEndEpochTime(dateInEpoch = Date.now()): {startTime: number, endTime: number} {
        const start = new Date(dateInEpoch);
        start.setUTCHours(0,0,0,0);
        const end = new Date(dateInEpoch);
        end.setUTCHours(23,59,59,999);
        return {
            startTime: start.getTime(),
            endTime: end.getTime()
        }
    }

    public log<T>(logData: IPerfLog<T>) {
        if(!logData.createdOn){
            logData.createdOn = Date.now();
        }
        this.dbSDK.insertDoc(DB_NAME, logData).catch(error => {
            this.standardLog.error({ id: 'PERF_LOGGER_INSERTION_FAILED', message: "perf_log data insertion error", error });
        });
    }

    private async archiveOldLogs() {

        try {
            let endDate = this.getStartAndEndEpochTime().startTime - 1 * MONTH_IN_MILLISECONDS;
            let archiveLogs = await this.getLogsFromDB({ startTime: 0, endTime: endDate }, { fields: ['_id', '_rev'] });

            if (!archiveLogs || !archiveLogs.length) {
                return;
            }
            const toBeDeleted = archiveLogs.map((data: any) => ({ _id: data._id, _rev: data._rev, _deleted: true }));
            await this.dbSDK.bulkDocs(DB_NAME, toBeDeleted);
        } catch (error) {
            this.standardLog.error({ id: 'PERF_LOGGER_ARCHIVE_FAILED', message: "Error while archiving old logs", error });
        }
    }

}
