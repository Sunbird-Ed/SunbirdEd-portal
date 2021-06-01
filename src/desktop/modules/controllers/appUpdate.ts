import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as os from "os";
import config from "../config";
import Response from "../utils/response";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
import { Inject } from 'typescript-ioc';

const systemInfo = {
    x32: "32bit",
    ia32: "32bit",
    x64: "64bit",
    ppc64: "64bit",
    s390: "64bit",
    s390x: "64bit",
    win32: "windows",
    linux: "linux",
};

export default class Appupdate {
    private deviceId;
    @Inject private standardLog: StandardLogger;
    constructor(manifest) {
        this.getDeviceId(manifest);
        this.standardLog = containerAPI.getStandardLoggerInstance();
    }

    public async getDeviceId(manifest) {
        try {
            this.deviceId = await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
        } catch (error) {
            this.standardLog.error({ id: 'APP_UPDATE_DEVICE_ID_FETCH_FAILED', message: 'Caught exception while fetching device id', error });
        }
    }
    public async getDesktopAppUpdate(req, res) {
        try {
            const data = await this.checkForUpdate();
            this.standardLog.info({ id: 'APP_UPDATE_FETCH_SUCCESS', message: `result: ${data} found from desktop app update api`, mid: req.headers["X-msgid"] });
            return res.send(Response.success("api.desktop.update", _.get(data, "data.result"), req));
        } catch (error) {
            this.standardLog.error({ id: 'APP_UPDATE_REQUEST_FAILED', mid: req.headers["X-msgid"], message: "Received error while processing desktop app update request", error });
            res.status(500);
            return res.send(Response.error("api.desktop.update", 500));
        }
    }

    public async getAppInfo(req, res) {
            const data = await this.checkForUpdate().catch((error) =>
            this.standardLog.error({ id: 'APP_UPDATE_FETCH_APP)', message: `Received error while fetching api key in app update`, error }));
            return res.send(Response.success("api.app.info", {
                termsOfUseUrl: `${process.env.APP_BASE_URL}/term-of-use.html`,
                version: process.env.APP_VERSION,
                releaseDate: process.env.RELEASE_DATE,
                deviceId: this.deviceId,
                languages: config.get("LANGUAGES"),
                updateInfo: _.get(data, "data.result"),
            }, req ));
    }

    private async checkForUpdate(): Promise<any> {
            const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
                this.standardLog.error({ id: 'APP_UPDATE_FETCH_API_KEY_FAILED', message: `Received error while fetching api key in app update`, error: err });
            });
            const body = {
                request: {
                    appVersion: process.env.APP_VERSION,
                    os: systemInfo[os.platform()],
                    arch: systemInfo[os.arch()],
                },
            };
            const appConfig = {
                headers: {
                    "authorization": `Bearer ${apiKey}`,
                    "content-type": "application/json",
                },
            };
            return HTTPService.post(`${process.env.APP_BASE_URL}/api/desktop/v1/update`, body, appConfig)
            .toPromise();
    }
}
