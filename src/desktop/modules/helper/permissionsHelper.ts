import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as _ from "lodash";
import { ILoggedInUser } from '../../OpenRAP/interfaces/IUser';
import uuid = require("uuid");

const PERMISSIONS_HELPER = {

  setUserSessionData(reqObj, body) {
    try {
      if (body.responseCode === "OK") {
        reqObj.session.userId = body.result.response.identifier;
        if (body.result.response.managedBy) {
          reqObj.session.userSid = uuid();
        } else {
          reqObj.session.userSid = reqObj.sessionID;
        }
        if (body.result.response.managedToken) {
          reqObj.session.managedToken = body.result.response.managedToken;
        }
        reqObj.session.roles = body.result.response.roles;
        if (body.result.response.organisations) {
          _.forEach(body.result.response.organisations, (org) => {
            if (org.roles && _.isArray(org.roles)) {
              reqObj.session.roles = _.union(reqObj.session.roles, org.roles);
            }
            if (org.organisationId) {
              reqObj.session.orgs.push(org.organisationId);
            }
          });
        }
        reqObj.session.orgs = _.uniq(reqObj.session.orgs);
        reqObj.session.orgs = _.compact(reqObj.session.orgs);
        reqObj.session.roles = _.uniq(reqObj.session.roles);
        if (body.result.response.rootOrg && body.result.response.rootOrg.id) {
          reqObj.session.rootOrgId = body.result.response.rootOrg.id;
          reqObj.session.rootOrghashTagId = body.result.response.rootOrg.hashTagId;
          reqObj.session.rootOrg = body.result.response.rootOrg;
        }
        // For bulk upload user(s); `PUBLIC` role added.
        if (!_.includes(reqObj.session.roles, "PUBLIC")) {
          reqObj.session.roles.push("PUBLIC");
        }
      }
    } catch (e) {
      logger.error({ msg: "setUserSessionData :: Error while saving user session data", err: e });
    }
  },

  // Fetch user data from server
  async getUser(userData: { access_token: string, userId: string }, isManagedUser?: boolean): Promise<ILoggedInUser> {
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      logger.error(`Received error while fetching api key in getUser with error: ${err}`);
    });
    let url = `${process.env.APP_BASE_URL}/api/user/v3/read/${userData.userId}?fields=organisations,roles,locations,declarations`;
    if (isManagedUser) {
      url = url + "?withTokens=true";
    }
    const options = {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "x-authenticated-user-token": userData.access_token
      }
    };

    try {
      const response = await HTTPService.get(url, options).toPromise();
      const user: ILoggedInUser = _.get(response, 'data.result.response');
      return user;
    } catch (error) {
      logger.error("Error while getting user", error);
      throw { message: `User read failed with ${error}`, status: error.code || 500 }
    }
  },
  // Fetch user data from server
  async getManagedUsers(managedByUser: { access_token: string, userId: string }): Promise<ILoggedInUser> {
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      logger.error(`Received error while fetching api key in getManagedUser with error: ${err}`);
    });
    let url = `${process.env.APP_BASE_URL}/learner/user/v1/managed/${managedByUser.userId}`;
    const options = {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "x-authenticated-user-token": managedByUser.access_token
      }
    };

    try {
      const response = await HTTPService.get(url, options).toPromise();
      const user: ILoggedInUser = _.get(response, 'data.result.response');
      return user;
    } catch (error) {
      logger.error("Error while getting managed user", error);
      throw { message: `Managed user read failed with ${error}`, status: error.code || 500 }
    }
  },

};

export default PERMISSIONS_HELPER;
