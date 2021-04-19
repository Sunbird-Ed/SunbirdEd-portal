import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";

const LOG_PREFIX = "ODC";
export class StandardLog {
  deviceId: string;
  userId: string;
  userSDK;

  constructor() {
    this.userSDK = containerAPI.getUserSdkInstance();
    this.getUserId();
  }

  private async getUserId() {
    // Get logged in user ID
    const currentUserSession = await this.userSDK.getUserSession().catch(error => logger.error("Error while fetching User Id", error));
    const currentUserId = _.get(currentUserSession, 'userId');
    this.userId = currentUserId || 'anonymous';
  }

  public debug(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`,  actor };
    data.id = 'ODC_'
    logger.debug(data);
  }

  public error(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`,  actor };
    logger.error(data);
  }

  public info(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`,  actor };
    logger.info(data);
  }

  public warn(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`,  actor };
    logger.warn(data);
  }
}

export interface ILogData {
  id: string;
  mid?: string;
  message?: string;
  error?: string;
  object?: {
    id: string;   // eg. content/collection/group id
    type: string; // eg. Content, Course, Textbook etc
  }
}