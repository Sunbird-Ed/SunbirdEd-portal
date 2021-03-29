import { logger } from "@project-sunbird/logger";
import * as _ from 'lodash';
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
import Course from '../controllers/course';
import { manifest as manifestObj } from "./../manifest";
import { containerAPI } from "@project-sunbird/OpenRAP/api";

const DB_NAME = "batch_details";
const API_ID = "api.course.batch.read";

const course = new Course(manifestObj);
const userSDK = containerAPI.getUserSdkInstance();

export default class BatchDetails {
  @Inject private databaseSdk: DatabaseSDK;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
  }

  // Get logged in user ID
  private async getCurrentUserId() {
    const currentUserSession = await userSDK.getUserSession();
    const currentUserId = _.get(currentUserSession, 'userId');

    return currentUserId;
  }

  private async findBatch(identifier: string) {
    // Find if the content is existed in the database
    const query = {
      selector: { identifier },
    };
    return this.databaseSdk.find(DB_NAME, query);
  }

  public async get(req, res) {
    try {
      const batchId = req.params.batchId;
      let batchData = {};
      const response = await this.findBatch(batchId);

      if (_.get(response, 'docs.length')) {
        batchData = response.docs[0];
        res.status(200).send(Response.success(API_ID, { response: batchData }, req));
      } else {
        const userId = await this.getCurrentUserId();
        const results = await course.getCourses(userId);
        const courses = _.get(results, 'docs[0].courses');

        if (_.get(courses, 'length')) {
          const currentCourse = _.find(courses, { userId, batchId });
          if (currentCourse.batch) {
            res.status(200).send(Response.success(API_ID, { response: currentCourse.batch }, req));
          }
        }
        res.status(500).send(Response.error(API_ID, 500));
      }
    } catch (error) {
      logger.error(`Error while fetching content status from database with error message = ${error.message}`);
      res.status(500).send(Response.error(API_ID, 500));
    }
  }

  public async save(batchData) {
    try {
      const resp = await this.findBatch(batchData.identifier);

      if (_.get(resp, 'docs.length')) { // upsert if found
        await this.databaseSdk.upsert(DB_NAME, resp.docs[0]._id, batchData);
      } else { // insert if not found
        await this.databaseSdk.insert(DB_NAME, batchData);
      }
    } catch (error) {
      logger.error(`Error while inserting content status in database with error message = ${error.message}`);
    }
  }
}
