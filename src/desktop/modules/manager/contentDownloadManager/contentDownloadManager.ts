import * as fs from "fs";
import * as  _ from "lodash";
import { AutoWired, Inject, Singleton } from "typescript-ioc";
import * as path from "path";
import DatabaseSDK from "../../sdk/database";
import { logger } from "@project-sunbird/logger";
import { containerAPI, ISystemQueueInstance, ISystemQueue, SystemQueueReq, SystemQueueStatus } from "@project-sunbird/OpenRAP/api";
import { manifest } from "../../manifest";
import { ContentDownloader } from "./ContentDownloader";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import Response from "../../utils/response";
import uuid from "uuid/v4";
const DefaultRequestOptions = { headers: { "Content-Type": "application/json" } };
import HardDiskInfo from "../../utils/hardDiskInfo";

// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,

// })
@Singleton
export class ContentDownloadManager {
  @Inject private dbSDK: DatabaseSDK;
  private systemQueue: ISystemQueueInstance;
  private systemSDK;
  private ContentReadUrl = `${process.env.APP_BASE_URL}/api/content/v1/read/`;
  private ContentSearchUrl = `${process.env.APP_BASE_URL}/api/content/v1/search`;
  @Inject private standardLog = containerAPI.getStandardLoggerInstance();
  public async initialize() {
    this.systemQueue = containerAPI.getSystemQueueInstance(manifest.id);
    this.systemQueue.register(ContentDownloader.taskType, ContentDownloader);
    this.dbSDK.initialize(manifest.id);
    this.systemSDK = containerAPI.getSystemSDKInstance(manifest.id);
  }
  public async update(req, res) {
    const contentId = req.params.id;
    const reqId = req.headers["X-msgid"];
    let parentId = _.get(req.body, "request.parentId");
    try {
      const dbContentDetails = await this.dbSDK.get("content", contentId);
      const apiContentResponse = await HTTPService.get(`${this.ContentReadUrl}/${contentId}`, {}).toPromise();
      const apiContentDetail = apiContentResponse.data.result.content;
      if(apiContentDetail.pkgVersion <= dbContentDetails.pkgVersion){
        this.standardLog.debug({ id: 'CONTENT_UPDATE_UNAVAILABLE', message: `${reqId} Content update not available for contentId: ${contentId} with parentId: ${parentId}, ${apiContentDetail.pkgVersion}, ${dbContentDetails.pkgVersion}` });
        res.status(400);
        return res.send(Response.error("api.content.update", 400, "Update not available"));
      }
      let contentSize = apiContentDetail.size;
      let contentToBeDownloadedCount = 1;
      const contentDownloadList = {
        [apiContentDetail.identifier]: {
          downloadId: uuid(),
          identifier: apiContentDetail.identifier,
          url: apiContentDetail.downloadUrl,
          size: apiContentDetail.size,
          step: "DOWNLOAD",
        },
      };
      logger.debug(`${reqId} Content mimeType: ${apiContentDetail.mimeType}`);
  
      if (apiContentDetail.mimeType === "application/vnd.ekstep.content-collection") {
        logger.debug(`${reqId} Content childNodes: ${apiContentDetail.childNodes}`);
        const childNodeDetailFromApi = await this.getContentChildNodeDetailsFromApi(apiContentDetail.childNodes);
        const childNodeDetailFromDb = await this.getContentChildNodeDetailsFromDb(apiContentDetail.childNodes);
        const contentsToDownload = this.getAddedAndUpdatedContents(childNodeDetailFromApi, childNodeDetailFromDb);
        for (const content of contentsToDownload) {
          if (content.size && content.downloadUrl) {
            contentToBeDownloadedCount += 1;
            logger.debug(`${reqId} Content childNodes: ${content.identifier} added to list`);
            contentSize += content.size;
            contentDownloadList[content.identifier] = {
              downloadId: uuid(),
              identifier: content.identifier,
              url: content.downloadUrl,
              size: content.size,
              step: "DOWNLOAD",
            };
          } else {
            logger.debug(`${reqId} Content childNodes: ${content.identifier} download skipped ${content.size}, ${content.downloadUrl}`);
          }
        }
        let contentsToDelete = this.getDeletedContents(childNodeDetailFromDb, childNodeDetailFromApi);
        for (const content of contentsToDelete) {
          contentDownloadList[content.identifier] = {
            downloadId: uuid(),
            identifier: content.identifier,
            url: content.downloadUrl,
            size: content.size,
            step: "DELETE",
          };
        }
      }
      await this.checkDiskSpaceAvailability(contentSize, true);
      let queueMetaData = apiContentDetail;
      if(parentId){ // use parent name, mimeType, identifier in queue
        const dbParentDetails = await this.dbSDK.get("content", parentId);
        if(!dbParentDetails){
          throw "PARENT_NOT_DOWNLOADED";
        }
        queueMetaData = dbParentDetails;
      }
      const insertData: SystemQueueReq = {
        type: ContentDownloader.taskType,
        name: queueMetaData.name,
        group: ContentDownloader.group,
        metaData: {
          downloadedSize: 0,
          contentSize,
          contentDownloadList,
          contentId: queueMetaData.identifier,
          mimeType: queueMetaData.mimeType,
          contentType: queueMetaData.contentType,
          pkgVersion: queueMetaData.pkgVersion,
        },
      };
      const id = await this.systemQueue.add(insertData);
      logger.debug(`${reqId} Content update request added to queue`, insertData);
      return res.send(Response.success("api.content.download", { downloadId: id }, req));
    } catch (error) {
      this.standardLog.error({ id: 'CONTENT_UPDATE_FAILED', message: `Content update request failed for contentId: ${contentId}`, error });
      if (_.get(error, "code") === "LOW_DISK_SPACE") {
        res.status(507);
        return res.send(Response.error("api.content.update", 507, "Low disk space", "LOW_DISK_SPACE"));
      }
      res.status(500);
      return res.send(Response.error("api.content.update", 500));
    }
  }
  public async download(req, res) {
    const contentId = req.params.id;
    const reqId = req.headers["X-msgid"];
    try {
      const contentResponse = await HTTPService.get(`${this.ContentReadUrl}/${contentId}`, {}).toPromise();
      const contentDetail = contentResponse.data.result.content;
      let contentSize = contentDetail.size;
      let contentToBeDownloadedCount = 1;
      const contentDownloadList = {
        [contentDetail.identifier]: {
          downloadId: uuid(),
          identifier: contentDetail.identifier,
          url: contentDetail.downloadUrl,
          size: contentDetail.size,
          step: "DOWNLOAD",
        },
      };
      logger.debug(`${reqId} Content mimeType: ${contentDetail.mimeType}`);

      if (contentDetail.mimeType === "application/vnd.ekstep.content-collection") {
        logger.debug(`${reqId} Content childNodes: ${contentDetail.childNodes}`);
        const childNodeDetail = await this.getContentChildNodeDetailsFromApi(contentDetail.childNodes);
        for (const content of childNodeDetail) {
          if (content.size && content.downloadUrl) {
            contentToBeDownloadedCount += 1;
            logger.debug(`${reqId} Content childNodes: ${content.identifier} added to list`);
            contentSize += content.size;
            contentDownloadList[content.identifier] = {
              downloadId: uuid(),
              identifier: content.identifier,
              url: content.downloadUrl,
              size: content.size,
              step: "DOWNLOAD",
            };
          } else {
            logger.debug(`${reqId} Content childNodes: ${content.identifier} download skipped ${content.size}, ${content.downloadUrl}`);
          }
        }
      }
      await this.checkDiskSpaceAvailability(contentSize, true);
      const insertData: SystemQueueReq = {
        type: ContentDownloader.taskType,
        name: contentDetail.name,
        group: ContentDownloader.group,
        metaData: {
          downloadedSize: 0,
          contentSize,
          contentDownloadList,
          contentId,
          mimeType: contentDetail.mimeType,
          contentType: contentDetail.contentType,
          pkgVersion: contentDetail.pkgVersion,
        },
      };
      const id = await this.systemQueue.add(insertData);
      logger.debug(`${reqId} Content download request added to queue`, insertData);
      const contentsToBeDownloaded = _.map(insertData.metaData.contentDownloadList, (data) => {
        return data.identifier;
      });
      return res.send(Response.success("api.content.download", { downloadId: id, contentsToBeDownloaded }, req));

    } catch (error) {
      const traceId = _.get(error, 'data.params.msgid');
      this.standardLog.error({ id: 'CONTENT_DOWNLOAD_FAILED', message: `Content download request failed for contentId: ${contentId}, trace Id: ${traceId}`, error });
      if (_.get(error, "code") === "LOW_DISK_SPACE") {
        res.status(507);
        return res.send(Response.error("api.content.download", 507, "Low disk space", "LOW_DISK_SPACE"));
      }
      res.status(500);
      return res.send(Response.error("api.content.download", 500));
    }
  }
  public async pause(req, res) {
    const downloadId = req.params.downloadId;
    const reqId = req.headers["X-msgid"];
    try {
      await this.systemQueue.pause(downloadId);
      return res.send(Response.success("api.content.pause.download", downloadId, req));
    } catch (error) {
      const status = _.get(error, "status") || 500;
      res.status(status);
      return res.send(Response.error("api.content.pause.download", status,
        _.get(error, "message"), _.get(error, "code")));
    }
  }

  public async resume(req, res) {
    const downloadId = req.params.downloadId;
    const reqId = req.headers["X-msgid"];
    try {
      await this.systemQueue.resume(downloadId);
      return res.send(Response.success("api.content.resume.download", downloadId, req));
    } catch (error) {
      const status = _.get(error, "status") || 500;
      res.status(status);
      return res.send( Response.error("api.content.resume.download", status, _.get(error, "message"), _.get(error, "code")));
    }
  }

  public async cancel(req, res) {
    const downloadId = req.params.downloadId;
    const reqId = req.headers["X-msgid"];
    try {
      await this.systemQueue.cancel(downloadId);
      return res.send(Response.success("api.content.pause.download", downloadId, req));
    } catch (error) {
      const status = _.get(error, "status") || 500;
      res.status(status);
      return res.send( Response.error("api.content.cancel.download", status, _.get(error, "message"), _.get(error, "code")));
    }
  }

  public async retry(req, res) {
    const downloadId = req.params.downloadId;
    const reqId = req.headers["X-msgid"];
    try {
      await this.systemQueue.retry(downloadId);
      return res.send(Response.success("api.content.retry.download", downloadId, req));
    } catch (error) {
      const status = _.get(error, "status") || 500;
      res.status(status);
      return res.send( Response.error("api.content.retry.download", status,
        _.get(error, "message"), _.get(error, "code")));
    }
  }

  private getContentChildNodeDetailsFromApi(childNodes) {
    if (!childNodes || !childNodes.length) {
      return Promise.resolve([]);
    }
    const requestBody = {
      request: {
        filters: {
          identifier: childNodes,
          mimeType: { "!=": "application/vnd.ekstep.content-collection" },
        },
        limit: childNodes.length,
      },
    };
    return HTTPService.post(this.ContentSearchUrl, requestBody, DefaultRequestOptions).toPromise()
      .then((response) => _.get(response, "data.result.content") || []);
  }
  private getContentChildNodeDetailsFromDb(childNodes) {
    if (!childNodes || !childNodes.length) {
      return Promise.resolve([]);
    }
    const selector = {
      selector: {
        $and: [
          {
            _id: {
              $in: childNodes
            }
          },
          {
            mimeType: {
              $nin: ["application/vnd.ekstep.content-collection"]
            }
          }
        ]
      }
    };
    return this.dbSDK.find("content", selector)
      .then((response) => _.get(response, "docs") || []);
  }
  private async checkDiskSpaceAvailability(zipSize, collection) {
    const availableDiskSpace = await HardDiskInfo.getAvailableDiskSpace();
    if (!collection && (zipSize + (zipSize * 1.5) > availableDiskSpace)) {
      throw { message: "Disk space is low, couldn't copy Ecar", code: "LOW_DISK_SPACE" };
    } else if (zipSize * 1.5 > availableDiskSpace) {
      throw { message: "Disk space is low, couldn't copy Ecar", code: "LOW_DISK_SPACE" };
    }
  }
  private getAddedAndUpdatedContents(liveContents, localContents) {
    const contents = _.filter(liveContents, data => {
      const found = _.find(localContents, {
        _id: data.identifier,
        pkgVersion: data.pkgVersion
      });
      return found ? false : true;
    });
    return contents;
  }

  private getDeletedContents(localContents, liveContents) {
    const contents = _.filter(localContents, data => {
      const found = _.find(liveContents, { identifier: data._id });
      return found ? false : true;
    });
    return contents;
  }
}
