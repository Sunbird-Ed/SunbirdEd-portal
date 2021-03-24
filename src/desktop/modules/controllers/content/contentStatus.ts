import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { NetworkQueue } from "@project-sunbird/OpenRAP/services/queue";
import * as _ from 'lodash';
import { Inject } from "typescript-ioc";
import { manifest } from "../../manifest";
import DatabaseSDK from "./../../sdk/database/index";
import Response from "./../../utils/response";

const DB_NAME = "content_status";
const API_ID = "api.content.state.read";
const userSDK = containerAPI.getUserSdkInstance();

export default class ContentStatus {
  @Inject private databaseSdk: DatabaseSDK;
  private deviceId: string;
  private networkQueue: NetworkQueue;

  constructor(manifest) {
    this.networkQueue = containerAPI.getNetworkQueueInstance();
    this.databaseSdk.initialize(manifest.id);
  }

  // Get logged in user ID
  private async getCurrentUserId() {
    const currentUserSession = await userSDK.getUserSession();
    const currentUserId = _.get(currentUserSession, 'userId');

    return currentUserId;
  }

  private async findContentStatus(contentId: string, batchId: string, courseId: string, userId: string) {
    // Find if the content is existed in the database
    const query = {
      selector: { contentId, batchId, courseId, userId },
    };
    return this.databaseSdk.find(DB_NAME, query);
  }

  public async getLocalContentStatusList(req, res) {
    try {
      const currentUserId = await this.getCurrentUserId();
      const request = _.get(req, 'body.request');
      const { userId = currentUserId, courseId, batchId } = request;

      const contentList = [];
      await Promise.all(request.contentIds.map(async (element) => {
        const content = await this.findContentStatus(element, batchId, courseId, userId);
        if (_.get(content, 'docs.length')) {
          contentList.push(content.docs[0]);
        }
      }));

      res.status(200).send(Response.success(API_ID, { contentList }, req));
    } catch (error) {
      logger.error(`Error while fetching content status from database with error message = ${error.message}`);
      res.status(500).send(Response.error(API_ID, 500));
    }
  }

  public async saveContentStatus(contentStatusList = []) {
    try {
      const userId = await this.getCurrentUserId();
      contentStatusList.forEach(async (element) => {
        const resp = await this.findContentStatus(
          element.contentId,
          element.batchId,
          element.courseId,
          userId
        );

        if (_.get(resp, 'docs.length')) { // upsert if found
          await this.databaseSdk.upsert(DB_NAME, resp.docs[0]._id, element);
        } else { // insert if not found
          element.userId = userId;
          await this.databaseSdk.insert(DB_NAME, element);
        }
      });
    } catch (error) {
      logger.error(`Error while inserting content status in database with error message = ${error.message}`);
    }
  }

  async update(req, res) {
    this.deviceId = this.deviceId || await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
    const userToken: any = await userSDK.getUserToken().catch(error => { logger.debug("Unable to get the user token", error); });
    const loggedInUserSession: any = await userSDK.getUserSession().catch(error => { logger.debug("User not logged in", error); });
    const currentUser: any = await userSDK.getLoggedInUser(loggedInUserSession.userId, true).catch(error => { logger.debug("Unable to get the user token", error); });

    let headers = {
      "Content-Type": "application/json",
      "did": this.deviceId,
      "X-Authenticated-Userid": loggedInUserSession.userId,
      "x-authenticated-user-token": userToken
    };

    const request = {
      bearerToken: true,
      pathToApi: `${process.env.APP_BASE_URL}/api/course/v1/content/state/update`,
      requestHeaderObj: headers,
      subType: "CONTENT_STATE_UPDATE",
      requestBody: req.body,
      requestMethod: "PATCH"
    };

    this.networkQueue.add(request).then(async(data) => {
      logger.info("Added in queue");
      const contents = _.get(req, 'body.request.contents');
      const contentIds = _.map(contents, item => item.contentId);
      const result = contentIds.reduce((o, key) => ({ ...o, [key]: 'SUCCESS' }), {});
      await this.saveContentStatus(contents);
      res.status(200).send(Response.success("api.content.state.update", { result }, req));
    }).catch((error) => {
      logger.error("Error while adding to Network queue", error);
      res.status(500).send(Response.error("api.content.state.update", 500));
    });
  }
}
