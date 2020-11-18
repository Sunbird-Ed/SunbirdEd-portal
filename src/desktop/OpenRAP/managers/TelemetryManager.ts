/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */

import { DataBaseSDK } from "../sdks/DataBaseSDK";
import { Inject, Singleton } from "typescript-ioc";
import * as _ from "lodash";
import SystemSDK from "../sdks/SystemSDK";
import { logger } from "@project-sunbird/logger";
import { ClassLogger } from '@project-sunbird/logger/decorator';
import * as zlib from "zlib";
import * as path from "path";
import * as fs from "fs";
import FileSDK from "../sdks/FileSDK";
import uuid = require("uuid");
import { TelemetryInstance } from "../services/telemetry/telemetryInstance";
import { HTTPService } from "../services/httpService";
import SettingSDK from "../sdks/SettingSDK";
import { NetworkQueue, NETWORK_SUBTYPE } from '../services/queue/networkQueue';
import { EventManager } from "./EventManager";

@Singleton
export class TelemetryManager {
  @Inject
  private networkQueue: NetworkQueue;
  @Inject
  private databaseSdk: DataBaseSDK;
  @Inject
  private systemSDK: SystemSDK;
  @Inject
  private telemetryInstance: TelemetryInstance;
  private settingSDK = new SettingSDK('openrap-sunbirded-plugin');
  private TELEMETRY_PACKET_SIZE =
    parseInt(process.env.TELEMETRY_PACKET_SIZE) || 200;

  private ARCHIVE_EXPIRY_TIME = 10; // in days

  async migrateTelemetryPacketToQueueDB() {
    try {
      let telemetryPackets = await this.databaseSdk.list("telemetry_packets", { include_docs: true });
      telemetryPackets = _.filter(telemetryPackets.rows, (o) => { return !o.doc.syncStatus; });

      if (!telemetryPackets || telemetryPackets.length === 0) { return; }      

      for (const telemetryPacket of telemetryPackets) {
        const packet = telemetryPacket.doc;
        let did = await this.systemSDK.getDeviceId();
        let headers = {
          "Content-Type": "application/json",
          did: did,
          msgid: _.get(packet, '_id')
        };
        const zipData = JSON.stringify({ ts: Date.now(), events: _.get(packet, 'events'), id: "api.telemetry", ver: "1.0" })
        zlib.gzip(zipData, async (error, result) => {
          if (error) {
            throw Error(JSON.stringify(error));
          } else {
            let dbData = {
              pathToApi: `${process.env.APP_BASE_URL}/api/data/v1/telemetry`,
              requestHeaderObj: headers,
              requestBody: result,
              subType: NETWORK_SUBTYPE.Telemetry,
              size: result.length,
              count: packet.length,
              bearerToken: true
            };
            // Inserting to Queue DB
            await this.networkQueue.add(dbData, _.get(packet, '_id'))
              .then(async data => {
                logger.info('Adding to Queue db successful from telemetry packet db');
                let resp = await this.databaseSdk.updateDoc("telemetry_packets", packet._id, { syncStatus: true, _deleted: true });
                return resp;
              })
              .catch(err => {
                logger.error("Adding to queue Db failed while migrating from telemetry packet db", err);
              });
          }
        });
      }
    } catch (error) {
      logger.error(`Got error while migrating telemetry packet db data to queue db ${error}`);
      this.networkQueue.logTelemetryError(error);
    }
  }

  async batchJob() {
    try {
      let did = await this.systemSDK.getDeviceId();
      let dbFilters = {
        selector: {},
        limit: this.TELEMETRY_PACKET_SIZE * 100
      };
      let telemetryEvents = await this.databaseSdk.find("telemetry", dbFilters);
      if (telemetryEvents.docs.length === 0) return;
      logger.info(
        `Batching telemetry events size ${telemetryEvents.docs.length} of chunk size each ${this.TELEMETRY_PACKET_SIZE}`
      );
      let updateDIDFlag = process.env.MODE === "standalone";
      let formatedEvents = _.map(telemetryEvents.docs, doc => {
        let omittedDoc = _.omit(doc, ["_id", "_rev"]);
        //here we consider all the events as anonymous usage and updating the uid and did if
        if (updateDIDFlag) {
          omittedDoc["actor"]["id"] = did;
          omittedDoc["context"]["did"] = did;
        }
        return omittedDoc;
      });

      let id = uuid.v4();

      let headers = {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
        did: did,
        msgid: id
      };

      const packets = _.chunk(formatedEvents, this.TELEMETRY_PACKET_SIZE);
      for (let packet of packets) {
        const zipData = JSON.stringify({ ts: Date.now(), events: packet, id: "api.telemetry", ver: "1.0" })
        zlib.gzip(zipData, async (error, result) => {
          if (error) {
            throw Error(JSON.stringify(error));
          } else {
            let dbData = {
              pathToApi: `${process.env.APP_BASE_URL}/api/data/v1/telemetry`,
              requestHeaderObj: headers,
              requestBody: result,
              subType: NETWORK_SUBTYPE.Telemetry,
              size: result.length,
              count: packet.length,
              bearerToken: true
            };
            await this.networkQueue.add(dbData, id);
            logger.info(`Added telemetry packets to queue DB of size ${packets.length}`);
            const deleteEvents = _.map(telemetryEvents.docs, data => ({ _id: data._id, _rev: data._rev, _deleted: true }));
            telemetryEvents = await this.databaseSdk.bulkDocs("telemetry", deleteEvents);
            logger.info(`Deleted telemetry events of size ${deleteEvents.length} from telemetry db`);
          }
        });
      }
    } catch (error) {
      logger.error(`Error while batching the telemetry events = ${error}`);
      this.networkQueue.logTelemetryError(error);
    }
  }

  async archive() {
    EventManager.subscribe("telemetry-synced", async (data) => {
      let { requestBody, _id, size } = data;
      logger.info(`Archiving telemetry started with id = ${_id}`);
      let bufferData = Buffer.from(requestBody.data);
      let fileSDK = new FileSDK("");
      await fileSDK.mkdir("telemetry_archived");
      let filePath = fileSDK.getAbsPath(
        path.join("telemetry_archived", _id + "." + Date.now() + ".gz")
      );
      let wstream = fs.createWriteStream(filePath);
      wstream.write(bufferData);
      wstream.end();
      wstream.on("finish", () => {
        logger.info(`${bufferData.length} events are wrote to file ${filePath} and  deleting events from telemetry database`);
      });
      const logEvent = {
        context: {
          env: "telemetryManager"
        },
        edata: {
          level: "INFO",
          type: "JOB",
          message: "Archived the telemetry events to file system",
          params: [{ packet: _id }, { size: size }]
        }
      };
      this.telemetryInstance.log(logEvent);

      //delete if the file is archived file is older than 10 days
      let archiveFolderPath = fileSDK.getAbsPath("telemetry_archived");
      fs.readdir(archiveFolderPath, (error, files) => {
        //filter gz files
        if (error) {
          logger.error(`While filtering gz files = ${error}`);
          this.networkQueue.logTelemetryError(error);
        } else if (files.length !== 0) {
          let now = Date.now();
          let expiry = this.ARCHIVE_EXPIRY_TIME * 86400;
          for (const file of files) {
            let fileArr = file.split(".");

            let createdOn = Number(fileArr[fileArr.length - 2]);
            if ((now - createdOn) / 1000 > expiry) {
              logger.info(`deleting file ${file} which is created on ${createdOn}`);
              fileSDK.remove(path.join("telemetry_archived", file));
            }
          }
        }
      });
    });
  }


}
