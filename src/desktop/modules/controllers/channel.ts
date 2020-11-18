import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";

import { ClassLogger } from "@project-sunbird/logger/decorator";

// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
export class Channel {
  @Inject
  private databaseSdk: DatabaseSDK;

  private fileSDK;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
  }

  public async insert() {
    try {
      const files =  await this.fileSDK.readdir(path.join("data", "channels"));
      const channelsFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "channels"));
      let channelsList =  await this.databaseSdk.list("channel", {});
      channelsList = _.get(channelsList, "rows");
      const channelsListLength = channelsList ? channelsList.length : 0;
      const channelDocs = [];
      for (const file of files) {
        const id = path.basename(file, path.extname(file));
        let isInserted: any = false;
        if (channelsListLength > 0) {
           isInserted = _.find(channelsList, {id});
        }
        if (!isInserted) {
          logger.info(`${id} is not inserted`);
          const channel = await this.fileSDK.readJSON(path.join(channelsFilesBasePath, file));
          const doc = _.get(channel, "result.channel");
          doc._id = id;
          channelDocs.push(doc);
        } else {
          logger.info(`${id} is inserted`);
        }
      }
      if (channelDocs.length) {
        await this.databaseSdk.bulk("channel", channelDocs);
      }
    } catch (error) {
      logger.error(
        `While inserting channels ${error.message} ${error.stack}`,
      );
    }
  }

  public get(req, res) {
    const id = req.params.id;
    logger.info(
      `ReqId = "${req.headers["X-msgid"]}": Getting the data from channel database with id: ${id}`,
    );
    this.databaseSdk
      .get("channel", id)
      .then((data) => {
        logger.info(
          `ReqId = "${req.headers["X-msgid"]}": Received data from channel database`,
        );
        data = _.omit(data, ["_id", "_rev"]);
        const resObj = {
          channel: data,
        };
        return res.send(Response.success("api.channel.read", resObj, req));
      })
      .catch((err) => {
        logger.error(
          `ReqId = "${req.headers["X-msgid"]}": Received error while getting the data from channel database with id: ${id} and err.message: ${err.message} ${err}`,
        );
        if (err.status === 404) {
          res.status(404);
          return res.send(Response.error("api.channel.read", 404));
        } else {
          const status = err.status || 500;
          res.status(status);
          return res.send(Response.error("api.channel.read", status));
        }
      });
  }
}
