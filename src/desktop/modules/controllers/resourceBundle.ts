import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

import { ClassLogger } from "@project-sunbird/logger/decorator";

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
export class ResourceBundle {
  // resourceBundleFiles
  @Inject
  private databaseSdk: DatabaseSDK;
  @Inject private standardLog: StandardLogger;

  private fileSDK;
  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.standardLog = containerAPI.getStandardLoggerInstance();
  }

  public async insert() {
    try {
      const files =  await this.fileSDK.readdir(path.join("data", "resourceBundles"));
      const resourceBundlesFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "resourceBundles"));
      let resourceBundlesList =  await this.databaseSdk.list("resource_bundle", {startkey: "_design0"});
      resourceBundlesList = _.get(resourceBundlesList, "rows");
      const resourceBundlesListLength = resourceBundlesList ? resourceBundlesList.length : 0;
      const resourceBundleDocs = [];
      for (const file of files) {
        if (!file.startsWith('generalized_')) {
          const id = path.basename(file, path.extname(file));
          let docInfo: undefined | object;
          if (resourceBundlesListLength > 0) {
            docInfo = _.find(resourceBundlesList, { id });
          }
          const doc = await this.fileSDK.readJSON(path.join(resourceBundlesFilesBasePath, file));
          doc._id = id;
          if (docInfo) {
            doc._rev = _.get(docInfo, "value.rev");
          }
          resourceBundleDocs.push(doc);
        }
      }
      if (resourceBundleDocs.length) {
        await this.databaseSdk.bulk("resource_bundle", resourceBundleDocs);
      }
    } catch (error) {
      this.standardLog.error({ id: 'resource_bundle_db_insert_failed', message: 'While inserting resource bundles', error });
    }
  }

  public get(req, res) {

    const id = req.params.id || "en";
    logger.info(
      `ReqId = "${req.headers["X-msgid"]}": Getting the data from resource_bundle database with id: ${id}`,
    );
    this.databaseSdk
      .get("resource_bundle", id)
      .then((data) => {
        data = _.omit(data, ["_id", "_rev"]);
        logger.info(
          `ReqId = "${req.headers["X-msgid"]}": Received data with id: ${id} in resource_bundle database`,
        );
        return res.send(Response.success("api.resoucebundles.read", data, req));
      })
      .catch((err) => {
        this.standardLog.error({ id: 'resource_bundle_db_read_failed', message: `Received error while getting the data from resource_bundle database with id: ${id}`, mid: req.headers["X-msgid"] });
        if (err.status === 404) {
          res.status(404);
          return res.send(Response.error("api.resoucebundles.read", 404));
        } else {
          const status = err.status || 500;
          res.status(status);
          return res.send(Response.error("api.resoucebundles.read", status));
        }
      });
  }
}
