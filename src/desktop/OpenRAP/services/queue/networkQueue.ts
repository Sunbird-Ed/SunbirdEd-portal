import { Queue, QUEUE_TYPE } from './queue';
import { logger } from "@project-sunbird/logger";
import { Inject, Singleton } from "typescript-ioc";
import { HTTPService } from "./../httpService";
import { TelemetryInstance } from './../telemetry/telemetryInstance';
import * as _ from "lodash";
import { v4 as uuid } from 'uuid';
import NetworkSDK from "./../../sdks/NetworkSDK";
import { EventManager } from "./../../managers/EventManager";
import { retry, mergeMap, catchError } from 'rxjs/operators';
import { of, throwError, defer } from 'rxjs';
import SystemSDK from "../../sdks/SystemSDK";
import { DataBaseSDK } from "../../sdks/DataBaseSDK";
import SettingSDK from '../../sdks/SettingSDK';
import DeviceSDK from '../../sdks/DeviceSDK';

export enum NETWORK_SUBTYPE {
    Telemetry = "TELEMETRY"
};
export enum PRIORITY { first = 1 };
const successResponseCode = ['success', 'ok'];

@Singleton
export class NetworkQueue extends Queue {
    @Inject private networkSDK: NetworkSDK;
    @Inject private telemetryInstance: TelemetryInstance;
    @Inject private systemSDK: SystemSDK;
    @Inject private databaseSdk: DataBaseSDK;
    @Inject private settingSDK: SettingSDK;
    @Inject private deviceSDK: DeviceSDK;
    private concurrency: number = 6;
    private queueList = [];
    private running: number = 0;
    private retryCount: number = 5;
    private queueInProgress = false;
    private apiKey: string;
    private excludeSubType: string[];
    private isForceSync: boolean = false;

    async setSubType() {
        try {
            const dbData: any = await this.settingSDK.get('networkQueueInfo');
            this.excludeSubType = _.map(_.filter(dbData.config, { sync: false }), 'type');
        } catch (error) {
            this.excludeSubType = [];
        }
    }

    async add(doc: NetworkQueueReq, docId?: string) {
        let date = Date.now();
        let data = {
            ...doc,
            _id: docId || uuid(),
            createdOn: date,
            updatedOn: date,
            type: QUEUE_TYPE.Network,
            priority: PRIORITY.first,
        };
        let resp = await this.enQueue(data);
        this.start();
        return resp;
    }

    async start() {
        EventManager.subscribe("networkQueueInfo", async (data) => {
            await this.setSubType();
        });
        this.apiKey = this.apiKey || await this.getApiKey();
        if (this.running !== 0 || this.queueInProgress || this.isForceSync) {
            logger.warn("Job is in progress");
            return;
        }
        this.queueInProgress = true;
        // If internet is not available return
        let networkStatus: boolean = await this.networkSDK.isInternetAvailable();
        if (!networkStatus) {
            this.queueInProgress = false;
            logger.warn("Network syncing failed as internet is not available");
            return;
        }
        try {
            let query = {
                selector: {
                    type: QUEUE_TYPE.Network
                },
                limit: this.concurrency
            };
            if (!_.isEmpty(this.excludeSubType)) {
                query.selector['subType'] = {};
                query.selector['subType']['$nin'] = this.excludeSubType;
            }
            this.queueList = await this.getByQuery(query);

            // If no data is available to sync return
            if (!this.queueList || this.queueList.length === 0) {
                this.queueInProgress = false;
                logger.warn("No network queue available to sync");
                return;
            }
            logger.info(`Calling execute method to sync network queue of size = ${this.queueList.length}`);
            this.execute();
            this.queueInProgress = false;
        } catch (error) {
            this.queueInProgress = false;
            logger.error(`DB error while fetching network queue data = ${error}`);
            this.logTelemetryError(error, "DB_ERROR");
        }
    }

    private execute() {
        while (this.running < this.concurrency && this.queueList.length) {
            logger.info(`While loop in progress - ${this.running}`);
            const currentQueue = this.queueList.shift();
            currentQueue.requestHeaderObj['Authorization'] = currentQueue.bearerToken ? `Bearer ${this.apiKey}` : '';
            let requestBody = _.get(currentQueue, 'requestHeaderObj.Content-Encoding') === 'gzip' ? Buffer.from(currentQueue.requestBody.data) : currentQueue.requestBody;
            this.makeHTTPCall(currentQueue.requestHeaderObj, requestBody, currentQueue.pathToApi, currentQueue.requestMethod)
                .then(async resp => {
                    // For new API if success comes with new responseCode, add responseCode to successResponseCode
                    const traceId = _.get(resp, 'data.params.msgid');
                    if (_.includes(successResponseCode, _.toLower(_.get(resp, 'data.responseCode')))) {
                        logger.info(`Network Queue synced for id = ${currentQueue._id}, and traceId = ${traceId}`);
                        await this.deQueue(currentQueue._id).catch(error => {
                            logger.info(`Received error deleting id = ${currentQueue._id}`);
                        });
                        EventManager.emit(`${_.toLower(currentQueue.subType)}-synced`, currentQueue);
                        this.start();
                        this.running--;
                    } else {
                        logger.warn(`Unable to sync network queue with id = ${currentQueue._id}, and traceId = ${traceId}`);
                        await this.deQueue(currentQueue._id).catch(error => {
                            logger.info(`Received error deleting id = ${currentQueue._id}`);
                        });
                        this.running--;
                    }
                })
                .catch(async error => {
                    const traceId = _.get(error, 'data.params.msgid');
                    logger.error(`Error while syncing to Network Queue for id = ${currentQueue._id} and traceId = ${traceId}`, error.message);
                    this.logTelemetryError(error);
                    await this.deQueue(currentQueue._id).catch(error => {
                        logger.info(`Received error in catch for deleting id = ${currentQueue._id}`);
                    });
                    let dbData = {
                        pathToApi: _.get(currentQueue, 'pathToApi'),
                        requestHeaderObj: _.get(currentQueue, 'requestHeaderObj'),
                        requestBody: _.get(currentQueue, 'requestBody'),
                        subType: _.get(currentQueue, 'subType'),
                        size: _.get(currentQueue, 'size'),
                        bearerToken: _.get(currentQueue, 'bearerToken'),
                    };
                    this.running--;
                    await this.add(dbData, currentQueue._id);
                });
            this.running++;
        }
    }

    private async makeHTTPCall(headers: object, body: object, pathToApi: string, requestMethod = "POST") {
        return await defer(() => {
            switch (requestMethod) {
                case "POST": return HTTPService.post(pathToApi, body, { headers: headers })
                case "PATCH": return HTTPService.patch(pathToApi, body, { headers: headers })
                default: {
                    return HTTPService.post(pathToApi, body, { headers: headers })
                }
              }
        }).pipe(mergeMap((data) => {
            return of(data);
        }), catchError((error) => {
            if (_.get(error, 'response.status') >= 500 && _.get(error, 'response.status') < 599) {
                return throwError(error);
            } else {
                return of(error);
            }
        }), retry(this.retryCount)).toPromise();
    }

    private async getApiKey() {
        let did = await this.systemSDK.getDeviceId();
        return await this.deviceSDK.getToken(did);
    }

    public async forceSync(subType: string[]) {
        this.isForceSync = true;
        this.apiKey = this.apiKey || await this.getApiKey();
        let query = {
            selector: {
                subType: { $in: subType }
            },
            limit: this.concurrency
        };

        const dbData = await this.getByQuery(query);
        if (!dbData || dbData.length === 0) {
            this.isForceSync = false;
            this.setForceSyncInfo(subType);
            return 'All data is synced';
        }
        const resp = await this.executeForceSync(dbData, subType);
        if (resp) {
            this.isForceSync = false;
            throw {
                code: _.get(resp, 'response.statusText'),
                status: _.get(resp, 'response.status'),
                message: _.get(resp, 'response.data.message')
            }
        }
    }

    private async setForceSyncInfo(subType: string[]) {
        let dbResp;
        try {
            dbResp = await this.settingSDK.get('forceNetworkSyncInfo');
            dbResp = dbResp.forceSyncInfo;
        } catch (error) {
            dbResp = [];
        }
        let currentDate = Date.now();
        let newSyncArray = [];
        _.forEach(subType, (value) => {
            let found: any = _.find(dbResp, { type: value });
            if (found) {
                found.lastSyncedOn = currentDate;
            } else {
                newSyncArray.push({
                    "type": value,
                    "lastSyncedOn": currentDate
                })
            }
        });
        await this.settingSDK.put('forceNetworkSyncInfo', { forceSyncInfo: _.concat(newSyncArray, dbResp) });
    }

    private async executeForceSync(dbData, subType) {
        for (const currentQueue of dbData) {
            currentQueue.requestHeaderObj['Authorization'] = currentQueue.bearerToken ? `Bearer ${this.apiKey}` : '';
            let requestBody = _.get(currentQueue, 'requestHeaderObj.Content-Encoding') === 'gzip' ? Buffer.from(currentQueue.requestBody.data) : currentQueue.requestBody;
            try {
                let resp = await this.makeHTTPCall(currentQueue.requestHeaderObj, requestBody, currentQueue.pathToApi, currentQueue.requestMethod);
                const traceId = _.get(resp, 'data.params.msgid');
                if (_.includes(successResponseCode, _.toLower(_.get(resp, 'data.responseCode')))) {
                    logger.info(`Network Queue synced for id = ${currentQueue._id}, with trace Id = ${traceId}`);
                    await this.deQueue(currentQueue._id);
                    EventManager.emit(`${_.toLower(currentQueue.subType)}-synced`, currentQueue);
                } else {
                    logger.warn(`Unable to sync network queue with id = ${currentQueue._id}, with trace Id = ${traceId}`);
                    return resp;
                }
            } catch (error) {
                const traceId = _.get(error, 'data.params.msgid');
                logger.error(`Error while syncing to Network Queue for id = ${currentQueue._id} and trace Id = ${traceId}`, error.message);
                this.logTelemetryError(error);
                return error;
            }
        }
        await this.forceSync(subType);
    }

    logTelemetryError(error: any, errType: string = "SERVER_ERROR") {
        const errorEvent = {
            context: {
                env: "networkQueue"
            },
            edata: {
                err: errType === "DB_ERROR" ? "DB_ERROR" : "SERVER_ERROR",
                errtype: errType === "DB_ERROR" ? "DATABASE" : "SYSTEM",
                stacktrace: (error.stack || error.message || "").toString()
            }
        };
        this.telemetryInstance.error(errorEvent);
    }
}

export interface NetworkQueueReq {
    bearerToken: boolean;
    subType: string;
    pathToApi: string;
    requestHeaderObj: object;
    requestBody: any;
    count?: number;
    requestMethod?: string;
}
