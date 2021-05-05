import * as _ from "lodash";
import { TelemetryHelper } from "./telemetry-helper";
import { Singleton } from "typescript-ioc";
import { logger } from "@project-sunbird/logger";
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
export class TelemetryService extends TelemetryHelper {
  telemetryBatch = [];
  telemetryConfig: any = {};
  constructor() {
    super();
  }
  init(config) {
    // const orgDetails = await this.databaseSdk.getDoc(
    //   "organization",
    //   process.env.CHANNEL
    // );
    // get mode from process env if standalone use machine id as did for client telemetry also
    this.telemetryConfig = config;
    const telemetryLibConfig = {
      userOrgDetails: {
        userId: "anonymous",
        rootOrgId: config.rootOrgId,
        organisationIds: [config.hashTagId]
      },
      config: {
        pdata: config.pdata,
        batchsize: config.batchSize,
        endpoint: "",
        apislug: "",
        sid: config.sid,
        channel: config.hashTagId,
        env: config.env,
        enableValidation: config.enableValidation,
        timeDiff: 0,
        runningEnv: config.runningEnv || "server",
        dispatcher: {
          dispatch: this.dispatcher.bind(this)
        }
      }
    };
    super.init(telemetryLibConfig);
  }
  dispatcher(data) {
    this.telemetryConfig.dispatcher(_.cloneDeep([data]));
  }
}
