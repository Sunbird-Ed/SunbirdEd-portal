import { Inject, Singleton } from "typescript-ioc";
import SettingSDK from './SettingSDK';
import * as _ from "lodash";
import SystemSDK from "./SystemSDK";
import { HTTPService } from "./../services/httpService";
import uuid = require("uuid");
import axios from "axios";
import jwt from "jsonwebtoken";
import { DataBaseSDK } from "./DataBaseSDK";
import { StandardLogger } from '../services/standardLogger/standardLogger';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
export default class DeviceSDK {
    private settingSDK = new SettingSDK('openrap-sunbirded-plugin');
    @Inject private systemSDK: SystemSDK;
    @Inject private databaseSdk: DataBaseSDK;
    @Inject private standardLog: StandardLogger;
    private config: IConfig;
    private apiKey: string;
    private deviceRegistryV1APIPath = "/api/api-manager/v1/consumer/desktop_device/credential/register";
    private deviceRegistryV2APIPath = "/api/api-manager/v2/consumer/desktop_device/credential/register";

    initialize(config: IConfig) {
        this.config = config;
    }

    async register() {
        var interval = setInterval(async () => {
            let deviceId = await this.systemSDK.getDeviceId();
            let deviceSpec = await this.systemSDK.getDeviceInfo();
            let userDeclaredLocation = await this.settingSDK.get('location').catch(err => this.standardLog.error({ id: 'DEVICE_SDK_DB_READ_FAILED', message: 'Error while fetching user Location in registerDevice, error:', error: err.message }));
            if (_.isEmpty(userDeclaredLocation)) {
                return;
            }
            let body = {
                id: process.env.APP_ID,
                ver: process.env.APP_VERSION,
                ts: new Date().toISOString(),
                params: {
                    msgid: uuid.v4()
                },
                request: {
                    channel: process.env.CHANNEL,
                    producer: process.env.APP_ID,
                    dspec: deviceSpec,
                    userDeclaredLocation: {
                        state: _.get(userDeclaredLocation, 'state.name') || _.get(userDeclaredLocation, 'state'),
                        district: _.get(userDeclaredLocation, 'city.name') || _.get(userDeclaredLocation, 'district')
                    }
                }
            };
            HTTPService.post(`${process.env.DEVICE_REGISTRY_URL}/${deviceId}`, body, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
                .toPromise()
                .then(data => {
                    this.standardLog.info({ id: 'DEVICE_SDK_DEVICE_REGISTERED', message: `device registered successfully ${data.status}` });
                    clearInterval(interval);
                    this.getToken(deviceId);
                })
                .catch(error => {
                    this.standardLog.error({ id: 'DEVICE_SDK_UNABLE_TO_SYNC_DEVICE_DATA', message: `Unable to sync device data: ${error.message}` });
                });
        }, 30000);
    }

    async getToken(deviceId?: string) {
        let did = deviceId || await this.systemSDK.getDeviceId();
        // Return API key if already exist
        if (this.apiKey) {
            this.standardLog.info({ id: 'DEVICE_SDK_RECEIVED_TOKEN', message: "Received token from local" });
            return Promise.resolve(this.apiKey);
        }

        try {
            // Try to get it from DB, set in local and return
            let { api_key } = await this.databaseSdk.getDoc(
                "settings",
                "device_token"
            );
            this.apiKey = api_key;
            this.standardLog.info({ id: 'DEVICE_SDK_RECEIVED_TOKEN', message: "Received token from Database" });
            return Promise.resolve(this.apiKey);
        } catch (error) {
            // Try to get it from API, set in local and return
            if (_.get(this.config, 'key') && did) {
                const options = { 
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${_.get(this.config, 'key')}`
                    },
                    body: {
                        id: "api.device.register",
                        ver: "1.0",
                        ts: Date.now(),
                        request: {
                            key: did
                        }
                    }
                }
                await this.getBearerToken(options);
            } else {
                throw Error(`Token or deviceID missing to register device ${did}`);
            }
        }
    }

    async getTokenFromFallBackURL(options, fallBackURL = '') {
        this.standardLog.info({ id: 'DEVICE_SDK_FETCH_API_TOKEN', message: "Fetching API token from V1 api" });
        const apiPath = fallBackURL || this.deviceRegistryV1APIPath;
        const {headers, body} = options;
        try {
            let response = await axios.post(
                process.env.APP_BASE_URL + apiPath,
                body,
                { headers: headers }
            );
            let apiKey = "";
            if(apiPath === this.deviceRegistryV1APIPath) {
                let key = _.get(response, "data.result.key");
                let secret = _.get(response, "data.result.secret");
                apiKey = jwt.sign({ iss: key }, secret, { algorithm: "HS256" });
                this.standardLog.info({ id: 'DEVICE_SDK_RECEIVED_TOKEN', message: "Received token from V1 API" });
            } else {
                apiKey = _.get(response, "data.result.token");
                this.standardLog.info({ id: 'DEVICE_SDK_RECEIVED_TOKEN', message: `Received token from Fallback URL: ${fallBackURL}` });
            }
            await this.databaseSdk
            .upsertDoc("settings", "device_token", { api_key: apiKey })
            .catch(err => {
                this.standardLog.error({ id: 'DEVICE_SDK_DB_INSERT_FAILED', message: "while inserting the api key to the  database", error: err });
            });
            this.apiKey = apiKey;
            return this.apiKey;
        } catch (err) {
            this.standardLog.error({ id: 'DEVICE_SDK_DEVICE_REGISTER_FAIL', message: `Error while registering the device status ${_.get(err, 'response.status')} data ${err}` });
            return Promise.resolve(this.apiKey);
        }
    }

    async getBearerToken(options) {
        try {
            this.standardLog.info({ id: 'DEVICE_SDK_FETCHING_API_TOKEN_V2', message: "Fetching API token from V2 api" });
            const {headers, body} = options;
            let response = await axios.post(
                process.env.APP_BASE_URL+this.deviceRegistryV2APIPath,
                body,
                { headers: headers }
            );
            let apiKey = _.get(response, "data.result.token");
            if(!apiKey) {
                this.standardLog.info({ id: 'DEVICE_SDK_TOKEN_UNAVAILABLE', message: `Token is not available in V2: ${apiKey}` });  
                apiKey = await this.getTokenFromFallBackURL(options);
            }
            await this.databaseSdk
            .upsertDoc("settings", "device_token", { api_key: apiKey })
            .catch(err => {
                this.standardLog.error({ id: 'DEVICE_SDK_DB_UPDATE_FAILED', message: "while inserting the api key to the  database", error: err });
            });
            this.apiKey = apiKey;
            this.standardLog.info({ id: 'DEVICE_SDK_TOKE_RECEIVED', message: "Received token from V2 API" });  
            return Promise.resolve(this.apiKey);
        }  catch (err) {
            this.standardLog.error({ id: 'DEVICE_SDK_TOKEN_FETCH_FAILED', message:  `Error while fetching V2 auth token with response code ${err}` });
            if (err && err.response && err.response.status === 447) {
                const responseHeaders = err.response.headers;
                const fallBackUrl = responseHeaders ? responseHeaders['location'] : this.deviceRegistryV1APIPath;
                this.standardLog.debug({ id: 'DEVICE_SDK_TOKEN_FETCH', message: `Fetching AUTH TOKEN from fallback url ${fallBackUrl}` });
                await this.getTokenFromFallBackURL(options, fallBackUrl || this.deviceRegistryV1APIPath);
            } else {
                await this.getTokenFromFallBackURL(options);
            }
            return Promise.resolve(this.apiKey); 
        }
    }

    public async clearToken() {
        this.apiKey = undefined;
        await this.settingSDK.delete('device_token').catch(err => { 
            this.standardLog.error({ id: 'DEVICE_SDK_DELETE_FAILED', message: "while deleting the api key from the database", error: err }); 
        });
    }
}

export interface IConfig {
    key: string;
}

