import { Singleton, Inject } from "typescript-ioc";
import { TelemetryService } from "./telemetryService";
import { TelemetryConfig } from "./../../interfaces/telemetryConfig";
import { DataBaseSDK } from "./../../sdks/DataBaseSDK";
import * as _ from "lodash";
import { v4 as uuid } from 'uuid';
import { logger } from "@project-sunbird/logger";
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
export class TelemetryInstance extends TelemetryService {
  @Inject
  private databaseSdk: DataBaseSDK;

  private telemetryEvents: object[];
  sessionId: string;
  constructor() {
    super();
    this.sessionId = uuid();
    this.telemetryEvents = [];
    let telemetryValidation =
      _.toLower(process.env.TELEMETRY_VALIDATION) === "true" ? true : false;
    let config: TelemetryConfig = {
      pdata: {
        id: process.env.APP_ID,
        ver: process.env.APP_VERSION,
        pid: "desktop.app"
      },
      sid: this.sessionId, // Should be updated whenever user action is not performed for sometime
      env: "container",
      rootOrgId: process.env.ROOT_ORG_ID,
      hashTagId: process.env.ROOT_ORG_HASH_TAG_ID,
      batchSize: 1,
      enableValidation: telemetryValidation,
      runningEnv: "server",
      dispatcher: this.send.bind(this)
    };
    this.init(config);
    this.syncToDB();
  }
  send(events): Promise<any> {
    if (!_.isArray(events)) events = [events];
    this.telemetryEvents.push(...events);
    return Promise.resolve();
  }

  private syncToDB() {
    setInterval(() => {
      if (this.telemetryEvents.length > 0) {
        let events = this.telemetryEvents.splice(0);
        this.databaseSdk.bulkDocs("telemetry", events).catch(err => {
          this.telemetryEvents.push(...events);
          logger.error(
            `While syncing ${events.length} events from in memory to database`,
            err
          );
        });
      }
    }, 5000);
  }
}
