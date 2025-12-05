const _ = require('lodash');
const envHelper = require('./environmentVariablesHelper.js');
const axios = require('axios');
const { v1: uuidv1 } = require('uuid')
const dateFormat = require('dateformat')
const { logger } = require('@project-sunbird/logger');
const { getBearerToken, getAuthToken } = require('../helpers/kongTokenHelper')

const orgAdminAsCollaborator = async function assignOrgAdminAsCollaborator(req, res, next) {
    const resourceId = req.body.request.resourceId
    const userId = req.session.userId
    if ( (req.url == '/content/lock/v1/create') && req.body.request.isRootOrgAdmin) {
        const token =   getAuthToken(req);
        axios.get(envHelper.CONTENT_PROXY_URL +'/action/content/v3/read/' + resourceId + '?fields=collaborators,createdBy')
        .then((response) => {
            if (_.has(response.data.result.content, 'collaborators') && _.includes(response.data.result.content.collaborators, userId)) {
                next()
            } else if (_.has(response.data.result.content, 'createdBy') && userId === response.data.result.content.createdBy) {
                next()
            } else {
                const existingCollaborators =  _.has(response.data.result.content, 'collaborators') ? response.data.result.content.collaborators : [];
                existingCollaborators.push(userId);
                const config = {
                    method: "PATCH",
                    url: envHelper.CONTENT_PROXY_URL +"/action/system/v3/content/update/" + resourceId,
                    headers: {
                        'x-device-id': 'middleware',
                        'x-msgid': uuidv1(),
                        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                        'content-type': 'application/json',
                        'Authorization': 'Bearer ' + getBearerToken(req),
                        'x-authenticated-user-token': token,
                    },
                    data: {
                        "request": {
                            "content": {
                                "collaborators": existingCollaborators
                            }
                        }
                    },
                    validateStatus: () => true
                }
                axios(config).then(res => {
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
              }  
        })
    } else {
        next()
    }
}

module.exports = {
    orgAdminAsCollaborator
};