import { logger } from "@project-sunbird/logger";
import { EventManager } from "../../managers/EventManager";
import * as _ from "lodash";
import { Singleton, Inject } from 'typescript-ioc';
import { UserSDK } from '../../sdks/UserSDK';

const LOG_PREFIX = "ODC";
@Singleton
export class StandardLogger {
  userId: string;

  @Inject private userSDK: UserSDK;
  constructor() {
    this.getUserId();
    this.updateUserId();
  }

  private async getUserId() {
    // Get logged in user ID
    const currentUserSession = await this.userSDK.getUserSession().catch(error => logger.error("Error while fetching User Id", error));
    const currentUserId = _.get(currentUserSession, 'userId');
    this.userId = currentUserId || 'anonymous';
  }

  private updateUserId() {
    EventManager.subscribe("user:switched", (userId) => {
      this.userId = userId ? userId : this.userId;
    });
  }

  public debug(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`, actor };
    logger.debug(data);
  }

  public error(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`, actor };
    logger.error(data);
  }

  public info(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`, actor };
    logger.info(data);
  }

  public warn(logData: ILogData) {
    const actor = { id: this.userId, type: 'user' };
    const data = { ...logData, id: `${LOG_PREFIX}_${logData.id}`, actor };
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
