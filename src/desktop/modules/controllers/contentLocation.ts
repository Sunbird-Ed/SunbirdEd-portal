import { logger } from "@project-sunbird/logger";
import * as  _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as os from "os";
import * as path from "path";
import * as express from "express";

export default class ContentLocation {
  private fileSDK;
  private settingSDK;
  private manifestID;
  constructor(manifestId) {
    this.manifestID = manifestId;
    this.fileSDK = containerAPI.getFileSDKInstance(manifestId);
    this.settingSDK = containerAPI.getSettingSDKInstance(manifestId);
  }
  public async set(app, contentPath: string) {
    try {
      contentPath = path.join(contentPath, process.env.APP_NAME);
      const response: any = await this.settingSDK.get(`content_storage_location`).catch((error) => { logger.error("Error while getting content storage location", error); });
      const contentLocation = { location: [] };

      if (_.get(response, "location")) {
        response.location.push(contentPath);
        contentLocation.location = response.location;
      } else {
        contentLocation.location = [contentPath];
      }

      const status = await this.settingSDK.put(`content_storage_location`, contentLocation)
        .catch((error) => { logger.error("Error while adding data to setting SDK", error); });

      if (status) {
        this.setContentStaticRoute(app, contentPath);
        const fileSDKContentInstance = containerAPI.getFileSDKInstance(this.manifestID, contentPath);
        await fileSDKContentInstance.mkdir("content")
          .catch((error) => { logger.error("Error creating directory", error); });
      }

      return status;
    } catch (error) {
      logger.error("Error while setting content storage location", error);
      throw new error(error);
    }
  }

  public async get() {
    if (os.platform() === "win32") {
      try {
        const contentDirPath: any = await this.settingSDK.get(`content_storage_location`);

        if (_.get(contentDirPath, "location.length")) {
          return path.join(contentDirPath.location[contentDirPath.location.length - 1], "content");
        } else {
          return this.fileSDK.getAbsPath("content");
        }

      } catch (error) {
        logger.error("Error while getting content storage location", error);
        return this.fileSDK.getAbsPath("content");
      }
    } else {
      return this.fileSDK.getAbsPath("content");
    }
  }

  public setContentStaticRoute(app, contentPath: string) {
    app.use("/content", express.static(path.join(contentPath, "content")));
    app.use("/contentPlayer/preview/content", express.static(path.join(contentPath, "content")));
    app.use("/contentPlayer/preview", express.static(path.join(contentPath, "content")));
    app.use("/contentPlayer/preview/content/*/content-plugins", express.static(path.join(contentPath, "content")));
  }
}
