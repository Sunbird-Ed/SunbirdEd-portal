import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as _ from "lodash";
import { ILoggedInUser } from '../../OpenRAP/interfaces/IUser';
import uuid from "uuid/v4";

const PERMISSIONS_HELPER = {

  setUserSessionData(reqObj, body) {
    const standardLog = containerAPI.getStandardLoggerInstance();
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
      standardLog.error({ id: 'PERMISSION_HELPER_USER_SESSION_SAVE_FAILED', message: 'Error while saving user session data', error: e });
    }
  },

  // Fetch user data from server
  async getUser(userData: { access_token: string, userId: string }, isManagedUser?: boolean): Promise<ILoggedInUser> {
    const standardLog = containerAPI.getStandardLoggerInstance();
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      standardLog.error({ id: 'PERMISSION_HELPER_TOKEN_FETCH_FAILED', message: 'Received error while fetching api key in getUser', error: err });
    });
    let url = `${process.env.APP_BASE_URL}/api/user/v3/read/${userData.userId}?fields=organisations,roles,locations,declarations`;
    if (isManagedUser) {
      url = url + "&withTokens=true";
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
      const traceId = _.get(error, 'data.params.msgid');
      standardLog.error({ id: 'PERMISSION_HELPER_USER_READ_FAILED', message: `Error while getting user with trace id = ${traceId}`, error });
      throw { message: `User read failed with ${error}`, status: error.code || 500 }
    }
  },
  // Fetch user data from server
  async getManagedUsers(managedByUser: { access_token: string, userId: string }): Promise<ILoggedInUser> {
    const standardLog = containerAPI.getStandardLoggerInstance();
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      standardLog.error({ id: 'PERMISSION_HELPER_TOKEN_FETCH_FAILED', message: 'Received error while fetching api key in getManagedUser', error: err });
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
      const traceId = _.get(error, 'data.params.msgid');
      standardLog.error({ id: 'PERMISSION_HELPER_FETCH_MANAGED_USER_FAILED', message: `Error while getting managed user with trace Id = ${traceId}`, error });
      throw { message: `Managed user read failed with ${error}`, status: error.code || 500 }
    }
  },

};

export default PERMISSIONS_HELPER;
