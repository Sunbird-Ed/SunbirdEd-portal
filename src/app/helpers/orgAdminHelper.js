const _ = require('lodash');
const envHelper = require('./environmentVariablesHelper.js');
const axios = require('axios');
const uuidv1 = require('uuid/v1')
const dateFormat = require('dateformat')
const { logger } = require('@project-sunbird/logger');

const checkUserForCollaborator = async function getUser(resourceId, userId) {
    try {
      const response = await axios.get(envHelper.CONTENT_PROXY_URL +'/action/content/v3/read/' + resourceId + '?fields=collaborators');
      if (_.has(response.data.result.content, 'collaborators') && _.includes(response.data.result.content.collaborators, userId)) {
        return false
      } else {
        return true
      }
    } catch (error) {
      console.error(error);
    }
}


const orgAdminAsCollaborator = async function assignOrgAdminAsCollaborator(req, res, next) {
    const resourceId = req.body.request.resourceId
    const userId = req.session.userId
    if ( (req.url == '/content/lock/v1/create') && req.body.request.isRootOrgAdmin && checkUserForCollaborator(resourceId,userId)) {
        const config = {
            method: "PATCH",
            url: envHelper.CONTENT_PROXY_URL +"/action/system/v3/content/update/" + resourceId,
            headers: {
                'x-device-id': 'middleware',
                'x-msgid': uuidv1(),
                'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
            },
            data: {
                "request": {
                    "content": {
                        "collaborators": [
                            userId
                        ]
                    }
                }
            },
            validateStatus: () => true
        }
        await axios(config).then(res => {
            if (res.status == 200) {
                logger.info({
                    msg: 'org admin  - ' + userId + 'is now collaborator of ' + resourceId
                });
                next()
            } else {
                logger.error({
                    msg: 'content update failed using system api ' + config.url
                });
            }
        })
    } else {
        next()
    }
}

module.exports = {
    orgAdminAsCollaborator
};