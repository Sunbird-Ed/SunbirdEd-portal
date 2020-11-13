import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "OpenRAP/dist/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database";
import Response from "../utils/response";

import { ClassLogger } from "@project-sunbird/logger/decorator";

// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
export class Organization {
  @Inject
  private databaseSdk: DatabaseSDK;

  private fileSDK;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
  }

  public async insert() {

    try {
      const files =  await this.fileSDK.readdir(path.join("data", "organizations"));
      const oragnizationFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "organizations"));
      let organizationsList =  await this.databaseSdk.list("organization", {startkey: "_design0"});
      organizationsList = _.get(organizationsList, "rows");
      const organizationsListLength = organizationsList ? organizationsList.length : 0;
      const organizationDocs = [];
      for (const file of files) {
        const id = path.basename(file, path.extname(file));
        let isInserted: any = false;
        if (organizationsListLength > 0) {
           isInserted = _.find(organizationsList, {id});
        }
        if (!isInserted) {
          logger.info(`${id} is not inserted`);
          const organization = await this.fileSDK.readJSON(path.join(oragnizationFilesBasePath, file));
          const doc = _.get(organization, "result.response.content[0]");
          doc._id = id;
          organizationDocs.push(doc);
        } else {
          logger.info(`${id} is inserted`);
        }
      }
      if (organizationDocs.length) {
        await this.databaseSdk.bulk("organization", organizationDocs);
      }
    } catch (error) {
      logger.error(
        `While inserting organization ${error.message} ${error.stack}`,
      );
    }
  }

  public search(req, res) {

    const requestBody = req.body;

    const searchObj = {
      selector: _.get(requestBody, "request.filters"),
    };
    logger.debug(
      `ReqId = "${req.headers["X-msgid"]}": Finding the data from organization database`,
    );
    this.databaseSdk
      .find("organization", searchObj)
      .then((data) => {
        data = _.map(data.docs, (doc) => _.omit(doc, ["_id", "_rev"]));
        const resObj = {
          response: {
            content: data,
            count: data.length,
          },
        };
        logger.info(
          `ReqId = "${req.headers["X-msgid"]}": Received data from organization database`,
        );
        return res.send(Response.success("api.org.search", resObj, req));
      })
      .catch((err) => {
        logger.error(
          `ReqId = "${req.headers["X-msgid"]}": Received error while searching in organization database and err.message: ${err.message} ${err}`,
        );
        if (err.status === 404) {
          res.status(404);
          return res.send(Response.error("api.org.search", 404));
        } else {
          const status = err.status || 500;
          res.status(status);
          return res.send(Response.error("api.org.search", status));
        }
      });
  }
}
