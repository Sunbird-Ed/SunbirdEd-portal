import * as _ from "lodash";
import * as request from "request";
import uuid = require("uuid");
import { logger } from "@project-sunbird/logger";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import { response } from "express";
import { containerAPI } from "@project-sunbird/OpenRAP/api";

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
      logger.error({msg: "setUserSessionData :: Error while saving user session data", err: e});
    }
  },

  async getCurrentUserRoles(reqObj, userDetail?, isManagedUser?) {
    const userId = userDetail.userId || reqObj.session.userId;
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      logger.error(`Received error while fetching api key in app update with error: ${err}`);
    });
    let url = process.env.LEARNER_URL + "user/v1/read/" + userId;
    if (isManagedUser) {
      url = url + "?withTokens=true";
    }
    const options = {
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "x-authenticated-user-token": userDetail.access_token
      }
    };

    const response = await HTTPService.get(url, options).toPromise();
    this.setUserSessionData(reqObj, response);
    const sessionLog = {
      userId: reqObj.session.userId || null,
      rootOrgId: reqObj.session.rootOrgId || null,
      roles: reqObj.session.roles || null,
      userSid: reqObj.session.userSid || null,
      orgs: reqObj.session.orgs || null,
    };
    logger.info({ msg: "getCurrentUserRoles :: Session data set success", session: sessionLog });
    reqObj.session.save((err: any) => {
      if (err) {
        return err
      } else {
        return response
      }
    });
  },
};
export default PERMISSIONS_HELPER;
