import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI, ISystemQueueInstance } from "@project-sunbird/OpenRAP/api";
import { NetworkQueue } from "@project-sunbird/OpenRAP/services/queue";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import { ImportTelemetry } from "../manager/telemetryImportManager/telemetryImport";
import { TelemetryImportManager } from "../manager/telemetryImportManager/telemetryImportManager";
import Response from "../utils/response";
export default class Telemetry {
  @Inject
  private databaseSdk: DatabaseSDK;
  private telemetrySDK;
  private systemQueue: ISystemQueueInstance;
  private networkQueue: NetworkQueue;
  @Inject private telemetryImportManager: TelemetryImportManager;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.telemetrySDK = containerAPI.getTelemetrySDKInstance();
    this.telemetryImportManager.initialize();
    this.systemQueue = containerAPI.getSystemQueueInstance(manifest.id);
    this.networkQueue = containerAPI.getNetworkQueueInstance();
  }

  public addEvents(req, res) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    const events = req.body.events;
    if (_.isArray(events) && events.length) {
      logger.debug(
        `ReqId = "${req.headers["X-msgid"]}": telemetry service is called to add telemetryEvents`,
      );
      this.telemetrySDK
        .send(events)
        .then((data) => {
          logger.info(
            `ReqId = "${req.headers["X-msgid"]}": Telemetry events added successfully ${data}`,
          );
          return res.send(Response.success("api.telemetry", {}, req));
        })
        .catch((err) => {
          standardLog.error({id: 'TELEMETRY_DB_INSERT_FAILED', mid: req.headers["X-msgid"], message: 'Received error while inserting events to telemetry db', error: err});
          res.status(500);
          return res.send(Response.error("api.telemetry", 500));
        });
    } else {
      standardLog.error({id: 'TELEMETRY_DB_INSERTION_FAILED', message: `Received err and status: 400`, error: 'Empty events provided'});
      res.status(400);
      return res.send(Response.error("api.telemetry", 400));
    }
  }

  public getInfo(req, res) {
    this.telemetrySDK.info((err, data) => {
      if (err) {
        res.status(err.status || 500);
        return res.send(Response.error("api.telemetry.info", err.status || 500
          , err.errMessage || err.message, err.code));
      }
      res.status(200);
      res.send(Response.success(`api.telemetry.info`, {
        response: data,
      }, req));
    });
  }

  public async getTelemetrySyncSetting(req, res) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    try {
      const telemetryConfigData = await this.telemetrySDK.getTelemetrySyncSetting();
      res.status(200);
      return res.send(Response.success("api.telemetry.config.info", telemetryConfigData , req));
    } catch (err) {
      standardLog.error({ id: 'TELEMETRY_CONFIG_FETCH_FAILED', mid: req.headers["X-msgid"], message: 'Received error while getting telemetry config ', error: err });
      res.status(err.status || 500);
      return res.send(Response.error("api.telemetry.config.info", err.status || 500
        , err.errMessage || err.message, err.code));
    }
  }

  public async setTelemetrySyncSetting(req, res) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    try {
      const enable = _.get(req, "body.request.enable");
      if (enable === undefined || typeof enable !== "boolean") {
        res.status(400);
        return res.send(Response.error("api.telemetry.set.config", 400
        , "Enable key should exist and it should be boolean"));
      }
      const resp = await this.telemetrySDK.setTelemetrySyncSetting(enable);
      res.status(200);
      return res.send(Response.success("api.telemetry.set.config", { response: resp }, req));
    } catch (err) {
      standardLog.error({ id: 'TELEMETRY_CONFIG_SET_FAILED', mid: req.headers["X-msgid"], message: 'Received error while setting telemetry config ', error: err });
      res.status(err.status || 500);
      return res.send(Response.error("api.telemetry.set.config", err.status || 500
        , err.errMessage || err.message, err.code));
    }
  }

  public async sync(req, res) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    try {
      const type = _.get(req, "body.request.type");
      if (type === undefined || !_.isArray(type)) {
        res.status(400);
        return res.send(Response.error("api.desktop.sync", 400
          , "Type key should exist and it should be an array"));
      }
      const data = await this.networkQueue.forceSync(type);
      res.status(200);
      return res.send(Response.success("api.desktop.sync", { response: data }, req));
    } catch (err) {
      standardLog.error({ id: 'TELEMETRY_FORCE_SYNC_FAILED', mid: req.headers["X-msgid"], message: 'Received error syncing telemetry forcefully', error: err });
      res.status(err.status || 500);
      return res.send(Response.error("api.desktop.sync", err.status || 500, err.errMessage || err.message, err.code));
    }
  }

  public export(req, res) {
    const destFolder = req.query.destFolder;
    this.telemetrySDK.export(destFolder, (err, data) => {
      if (err) {
        res.status(err.status || 500);
        return res.send(Response.error("api.telemetry.export", err.status || 500, err.errMessage
          || err.message, err.code));
      }
      res.status(200);
      res.send(Response.success(`api.telemetry.export`, {
        response: data,
      }, req));
    });
  }

  public async import(req: any, res: any) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    const filePaths = req.body;
    if (!filePaths) {
      return res.status(400).send(Response.error(`api.telemetry.import`, 400, "MISSING_FILE_PATHS"));
    }
    this.telemetryImportManager.add(filePaths).then((jobIds) => {
      res.send(Response.success("api.telemetry.import", {
        importedJobIds: jobIds,
      }, req));
    }).catch((err) => {
      standardLog.error({ id: 'TELEMETRY_IMPORT_FAILED', mid: req.headers["X-msgid"], message: 'Received error importing telemetry', error: err });
      res.status(500);
      res.send(Response.error(`api.telemetry.import`, 500, err.errMessage || err.message, err.code));
    });
  }

  public async retryImport(req: any, res: any) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    this.telemetryImportManager.retryImport(req.params.importId).then((jobIds) => {
      res.send(Response.success("api.telemetry.import.retry", {
        jobIds,
      }, req));
    }).catch((err) => {
      standardLog.error({ id: 'TELEMETRY_IMPORT_RETRY_FAILED', mid: req.headers["X-msgid"], message: 'Received error retrying import', error: err });
      res.status(500);
      res.send(Response.error(`api.telemetry.import.retry`, 400, err.message));
    });
  }

  public async list(req: any, res: any) {
    const standardLog = containerAPI.getStandardLoggerInstance();
    try {
      let dbData = await this.systemQueue.query({ type: ImportTelemetry.taskType });
      dbData = _.map(dbData.docs, (data) => ({
        id: _.get(data, "_id"),
        name: _.get(data, "name"),
        progress: _.get(data, "progress"),
        failedCode: _.get(data, "failedCode"),
        failedReason: _.get(data, "failedReason"),
        addedUsing: _.toLower(_.get(data, "type")),
        totalSize: _.get(data, "metaData.fileSize"),
        createdOn: _.get(data, "createdOn"),
        status: _.get(data, "status"),
      }));
      return res.send(Response.success("api.telemetry.list", {
        response: {
          count: dbData.length,
          items: _.orderBy(dbData, ["createdOn"], ["desc"]),
        },
      }, req));
    } catch (error) {
      standardLog.error({ id: 'TELEMETRY_DB_READ_FAILED', message: 'Error while processing the telemetry import list request', mid: req.headers["X-msgid"], error });
      res.status(500);
      return res.send(Response.error("api.telemetry.list", 500));
    }
  }
}
