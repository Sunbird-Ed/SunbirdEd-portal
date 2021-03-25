import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as _ from 'lodash';
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "./../utils/response";

const DB_NAME = 'enrolled_trackable_collection';
const API_ID = "api.user.courses.list";
const userSDK = containerAPI.getUserSdkInstance();

export default class Course {
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

  public async getCourses(userId: string) {
    // Find if the user is existed in the database
    const query = {
      selector: { userId },
    };
    return this.databaseSdk.find(DB_NAME, query);
  }

  public async getLocalEnrolledList(req, res) {
    try {
      const userId = await this.getCurrentUserId();
      const results = await this.getCourses(userId);
      const courses = _.get(results, 'docs[0].courses');
      res.status(200).send(Response.success(API_ID, { courses }, req));
    } catch (error) {
      logger.error(`Error while fetching content status from database with error message = ${error.message}`);
      res.status(500).send(Response.error(API_ID, 500));
    }
  }

  public async saveEnrolledList(courses) {
    try {
      const userId = await this.getCurrentUserId();
      const results = await this.getCourses(userId);
      const inputData = { userId, courses: courses };

      if (_.get(results, 'docs.length')) {      // If doc is available then update the same doc
        const userData = results.docs[0];
        await this.databaseSdk.upsert(DB_NAME, userData._id, inputData)
      } else {                                  // if doc is not available then insert data to create new doc
        await this.databaseSdk.insert(DB_NAME, inputData);
      }

    } catch (error) {
      logger.error(`Error while inserting content status in database with error message = ${error.message}`);
    }
  }
}
