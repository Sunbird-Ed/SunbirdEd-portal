import * as  _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import { logger } from "@project-sunbird/logger";
import { DataBaseSDK } from "../../sdks/DataBaseSDK";
import { Inject, Singleton } from "typescript-ioc";
import FileSDK from "../../sdks/FileSDK";
import { Readable } from 'stream';
import SettingSDK from '../../sdks/SettingSDK'
import SystemSDK from "../../sdks/SystemSDK";
import { TelemetryHelper } from './telemetry-helper';

@Singleton
export class TelemetryExport {
    @Inject private databaseSdk: DataBaseSDK;
    @Inject private settingSDK: SettingSDK;
    @Inject private systemSDK: SystemSDK;
    @Inject private telemetryHelper: TelemetryHelper;
    private telemetryArchive;
    private cb;
    private destFolder: string;
    private telemetryShareItems: IShareItems[] = [];
    private deviceId: string;

    constructor() { this.setDeviceID() }

    private async setDeviceID() {
        this.deviceId = await this.systemSDK.getDeviceId();
    }

    public async export(destFolder: string, cb) {
        this.destFolder = destFolder;
        this.cb = cb;
        try {
            if (!this.destFolder) {
                throw {
                    code: "BAD_REQUEST",
                    status: 400,
                    message:'Destination path is missing'
                }
            }
            let fileSDK = new FileSDK("");
            let dbData = await this.databaseSdk.find("queue", {
                selector: {
                    subType: 'TELEMETRY',
                },
                fields: ['_id', 'size', 'requestHeaderObj', 'count']
            });

            if (!dbData.docs.length) {
                throw {
                    code: "DATA_NOT_FOUND",
                    status: 404,
                    message: 'No data to export'
                }
            }

            this.telemetryArchive = fileSDK.archiver();
            let items: IItems[] = [];
            this.telemetryShareItems = [];

            _.forEach(dbData.docs, (data) => {
                items.push({
                    objectType: 'telemetry',
                    file: `${data._id}.gz`,
                    contentEncoding: 'gzip',
                    size: data.size,
                    explodedSize: data.size,
                    mid: _.get(data, 'requestHeaderObj.msgid'),
                    eventsCount: data.count
                });
                this.telemetryShareItems.push({
                    id: _.get(data, "_id"),
                    type: "Telemetry",
                    params: [
                        { count: _.toString(_.get(data, "count")) },
                        { size: _.toString(_.get(data, "size")) },
                    ],
                    origin: {
                        id: this.deviceId,
                        type: "Device",
                    },
                });
                this.archiveAppend("stream", this.getStream(data._id), `${data._id}.gz`);
            })

            this.archiveAppend("buffer", this.getManifestBuffer(dbData.docs.length, items), "manifest.json");
            await this.streamZip();
            this.cb(null, 'success');
        } catch (error) {
            this.cb(error, null);
        }
    }

    private getStream(id: string) {
        let getData = (id: string) => {
            return new Promise((resolve, reject) => {
                this.databaseSdk.getDoc('queue', id).then((dbData) => {
                    resolve(Buffer.from(dbData.requestBody.data));
                }).catch((err) => {
                    reject(err)
                });
            });
        }
        const inStream = new Readable({
            read() {
                getData(id).then(data => {
                    this.push(data)
                    this.push(null)
                }).catch((err) => {
                    logger.error(`Received error while getting stream: ${err}`);
                    this.push('No Data found')
                    this.push(null)
                })
            }
        });
        return inStream;
    }

    private archiveAppend(type, src, dest) {
        if (type === "path") {
            this.telemetryArchive.append(fs.createReadStream(src), { name: dest });
        } else if (type === "stream") {
            this.telemetryArchive.append(src, { name: dest });
        } else if (type === "createDir") {
            dest = dest.endsWith("/") ? dest : dest + "/";
            this.telemetryArchive.append(null, { name: dest });
        } else if (type === "buffer") {
            this.telemetryArchive.append(src, { name: dest });
        }
    }

    private getManifestBuffer(count: number, items: IItems[]) {
        const manifestData = {
            id: "sunbird.data.archive",
            ver: process.env.APP_VERSION,
            ts: new Date(),
            producer: {
                id: process.env.APP_ID,
                ver: process.env.APP_VERSION,
                pid: "desktop.app"
            },
            archive: {
                count: count,
                items: items
            },
        };
        return Buffer.from(JSON.stringify(manifestData));
    }

    private async streamZip() {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.destFolder, `telemetry_${this.deviceId}_${Date.now()}.zip`);
            const output = fs.createWriteStream(filePath);
            output.on("close", () => resolve({}));
            output.on("error", (err) => {
                output.end();
                reject(err);
            });
            this.telemetryArchive.on("end", () => {
                logger.error("Data has been zipped");
                this.settingSDK.put('telemetryExportedInfo', { lastExportedOn: Date.now() });
                this.generateShareEvent(this.telemetryShareItems);
            });
            this.telemetryArchive.on("error", (err) => reject(err));
            this.telemetryArchive.finalize();
            this.telemetryArchive.pipe(output);
        });
    }

    public async info(cb) {
        this.cb = cb;
        try {
            let dbData = await this.databaseSdk.find("queue", {
                selector: { subType: 'TELEMETRY' },
                fields: ['size']
            });

            let totalSize: number = 0;
            if (dbData.docs.length) {
                _.forEach(dbData.docs, (data) => {
                    totalSize += data.size;
                })
            }

            let exportedDate;
            try {
                exportedDate = await this.settingSDK.get('telemetryExportedInfo');
            } catch (error) {
                exportedDate = { lastExportedOn: null };
            }

            let networkInfo;
            try {
                networkInfo = await this.settingSDK.get('forceNetworkSyncInfo');
            } catch (error) {
                networkInfo = {};
            }

            this.cb(null, { totalSize: totalSize, lastExportedOn: exportedDate.lastExportedOn, networkInfo });
        } catch (error) {
            this.cb(error, null);
        }
    }

    private generateShareEvent(shareItems: IShareItems[]) {
        const telemetryEvent: any = {
            context: {
                env: "Telemetry",
            },
            edata: {
                dir: "Out",
                type: "File",
                items: shareItems,
            },
        };
        this.telemetryHelper.share(telemetryEvent);
    }
}

export interface IItems {
    objectType: string;
    file: string;
    contentEncoding: string;
    size: number;
    explodedSize: number;
    mid: string;
    eventsCount: number;
}

export interface IShareItems {
    id: string;
    type: string;
    params: [
        { count: string },
        { size: string }
    ];
    origin: {
        id: string;
        type: string;
    };
}
