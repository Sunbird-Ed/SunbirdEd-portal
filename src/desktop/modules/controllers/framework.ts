import DatabaseSDK from "../sdk/database";

import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import Response from "../utils/response";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

export class Framework {
  @Inject
  private databaseSdk: DatabaseSDK;
  private fileSDK;
  @Inject private standardLog: StandardLogger;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.standardLog = containerAPI.getStandardLoggerInstance();
  }
  public async insert() {

    try {
      const files =  await this.fileSDK.readdir(path.join("data", "frameworks"));
      const frameworksFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "frameworks"));
      let frameworksList =  await this.databaseSdk.list("framework", {});
      frameworksList = _.get(frameworksList, "rows");
      const frameworksListLength = frameworksList ? frameworksList.length : 0;
      const frameworkDocs = [];
      for (const file of files) {
        const id = path.basename(file, path.extname(file));
        let isInserted: any = false;
        if (frameworksListLength > 0) {
           isInserted = _.find(frameworksList, {id});
        }
        if (!isInserted) {
          logger.info(`${id} is not inserted`);
          const framework = await this.fileSDK.readJSON(path.join(frameworksFilesBasePath, file));
          const doc = _.get(framework, "result.framework");
          doc._id = id;
          frameworkDocs.push(doc);
        } else {
          logger.info(`${id} is inserted`);
        }
      }
      if (frameworkDocs.length) {
        await this.databaseSdk.bulk("framework", frameworkDocs);
      }
    } catch (error) {
      this.standardLog.error({ id: 'FRAMEWORK_INSERT_FAILED', message: 'While inserting frameworks', error });
    }
  }

  public get(req: any, res: any): any {

    const id = req.params.id;
    logger.info(
      `ReqId = "${req.headers["X-msgid"]}": Getting the data from framework database with id: ${id}`,
    );
    this.databaseSdk
      .get("framework", id)
      .then((data) => {
        logger.info(
          `ReqId = "${req.headers["X-msgid"]}": Received data with id: ${id} from framework database`,
        );
        data = _.omit(data, ["_id", "_rev"]);
        const resObj = {
          framework: data,
        };
        return res.send(Response.success("api.framework.read", resObj, req));
      })
      .catch((err) => {
        this.standardLog.error({ id: 'FRAMEWORK_DB_READ_FAILED', message: 'Received error while getting the data from framework database', mid: req.headers["X-msgid"], error: err });
        if (err.status === 404) {
          res.status(404);
          return res.send(Response.error("api.framework.read", 404));
        } else {
          const status = err.status || 500;
          res.status(status);
          return res.send(Response.error("api.framework.read", status));
        }
      });
  }

  public upsert(framework) {
    const doc = _.get(framework, "result.framework");
    const id = doc.identifier;
    this.databaseSdk.upsert("framework", id, doc);
  }
}
