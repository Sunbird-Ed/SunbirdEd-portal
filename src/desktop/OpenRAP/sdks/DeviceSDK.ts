import { Inject, Singleton } from "typescript-ioc";
import SettingSDK from './SettingSDK';
import * as _ from "lodash";
import { logger } from "@project-sunbird/logger";
import SystemSDK from "./SystemSDK";
import { HTTPService } from "./../services/httpService";
import uuid = require("uuid");
import axios from "axios";
import jwt from "jsonwebtoken";
import { DataBaseSDK } from "./DataBaseSDK";
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
export default class DeviceSDK {
    private settingSDK = new SettingSDK('openrap-sunbirded-plugin');
    @Inject private systemSDK: SystemSDK;
    @Inject private databaseSdk: DataBaseSDK;
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
            let userDeclaredLocation = await this.settingSDK.get('location').catch(err => logger.error('Error while fetching user Location in registerDevice, error:', err.message));
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
                        district: _.get(userDeclaredLocation, 'city.name') || _.get(userDeclaredLocation, 'city')
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
                    logger.info(`device registered successfully ${data.status}`);
                    clearInterval(interval);
                    this.getToken(deviceId);
                })
                .catch(error => {
                    logger.error(`Unable to sync device data: ${error.message}`);
                });
        }, 30000);
    }

    async getToken(deviceId?: string) {
        let did = deviceId || await this.systemSDK.getDeviceId();
        // Return API key if already exist
        if (this.apiKey) {
            logger.info("Received token from local");
            return Promise.resolve(this.apiKey);
        }

        try {
            // Try to get it from DB, set in local and return
            let { api_key } = await this.databaseSdk.getDoc(
                "settings",
                "device_token"
            );
            this.apiKey = api_key;
            logger.info("Received token from Database");
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
        logger.info("Fetching API token from V1 api");
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
                logger.info("Received token from V1 API");
            } else {
                apiKey = _.get(response, "data.result.token");
                logger.info(`Received token from Fallback URL: ${fallBackURL}`);
            }
            await this.databaseSdk
            .upsertDoc("settings", "device_token", { api_key: apiKey })
            .catch(err => {
                logger.error("while inserting the api key to the  database", err);
            });
            this.apiKey = apiKey;
            return this.apiKey;
        } catch (err) {
            logger.error(
                `Error while registering the device status ${_.get(err, 'response.status')} data ${err}`
            );
            logger.info("Resolving error with invalid api key");
            return Promise.resolve(this.apiKey);
        }
    }

    async getBearerToken(options) {
        try {
            logger.info("Fetching API token from V2 api");
            const {headers, body} = options;
            let response = await axios.post(
                process.env.APP_BASE_URL+this.deviceRegistryV2APIPath,
                body,
                { headers: headers }
            );
            let apiKey = _.get(response, "data.result.token");
            if(!apiKey) {
                logger.info(`Token is not avialabe in V2: ${apiKey}`);  
                apiKey = await this.getTokenFromFallBackURL(options);
            }
            await this.databaseSdk
            .upsertDoc("settings", "device_token", { api_key: apiKey })
            .catch(err => {
                logger.error("while inserting the api key to the  database", err);
            });
            this.apiKey = apiKey;
            logger.info("Received token from V2 API");  
            return Promise.resolve(this.apiKey);
        }  catch (err) {
            logger.error(`Error while fetching V2 auth token with response code ${err}`);
            if (err && err.response && err.response.status === 447) {
                const responseHeaders = err.response.headers;
                const fallBackUrl = responseHeaders ? responseHeaders['location'] : this.deviceRegistryV1APIPath;
                logger.debug(`Fetching AUTH TOKEN from fallback url ${fallBackUrl}`);
                await this.getTokenFromFallBackURL(options, fallBackUrl || this.deviceRegistryV1APIPath);
            } else {
                await this.getTokenFromFallBackURL(options);
            }
            return Promise.resolve(this.apiKey); 
        }
    }
}

export interface IConfig {
    key: string;
}

