const { HTTPService } = require('@project-sunbird/ext-framework-server/services');
const envHelper = require('./environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const { logger } = require('@project-sunbird/logger');
const _ = require('lodash');
const { logError } = require('./utilityService.js');

getHeaders = () => {
  return {
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN,
    },
  };
}

isJSON = (batches) => {
  let parsedBatches = [];
  logger.debug({ msg: `isJSON() is called ` });
  try {
    parsedBatches = JSON.parse(batches);
  } catch (e) {
    parsedBatches = batches;
  }
  logger.info({ msg: `returning parsed JSON from isJSON() ${parsedBatches}` });
  return parsedBatches;
}


// To get Certificate details and course details
const getUserCertificates = async (req, userData, courseId, currentUser) => {
  logger.info({ msg: 'getUserCertificates() is called' });
  const requestParams = {
    request: {
      filters: {
        id: _.get(userData, 'locationIds[0]'),
        type: 'district'
      }
    }
  }

  let district;
  if (!_.isEmpty(_.get(userData, 'locationIds'))) {
  district = await getDistrictName(req, requestParams);

  if (_.isEmpty(district) && _.get(userData, 'locationIds') && _.get(userData, 'locationIds').length > 1) {
    requestParams.request.filters.id = _.get(userData, 'locationIds[1]');
    district = await getDistrictName(req, requestParams);
  }
}

  const courseData = await getUserEnrolledCourses(req, courseId, _.get(userData, 'identifier'))
  const resObj = {
    userId: _.get(userData, 'identifier'),
    userName: _.get(userData, 'firstName') + (_.get(userData, 'lastName') || ''),
    district: district,
    courses: courseData
  };
  return resObj;
};

const getDistrictName = async (req, requestParams) => {
  logger.info({ msg: `getDistrictName() is called with ${JSON.stringify(requestParams)} url: ${certRegURL + 'data/v1/location/search'}` })
  const response = await HTTPService.post(`${certRegURL + 'data/v1/location/search'}`, requestParams, getHeaders()).toPromise().catch(err => {
    logger.error({ msg: `Error occurred in  getLocation() error:  ${err}` });	
    });
  logger.info({ msg: `getDistrictName() is returning data ${_.get(response, 'data.result.response[0].name')}` })
  return (_.get(response, 'data.result.response[0].name'));
};

const getUserEnrolledCourses = async (req, courseId, userId) => {
  logger.info({ msg: `getUserEnrolledCourses() is called with userId ${userId}` });
    const appConfig = getHeaders();
    appConfig.headers['x-authenticated-user-token'] = _.get(req, 'kauth.grant.access_token.token') || _.get(req, 'headers.x-authenticated-user-token');
    const response = await HTTPService.get(`${certRegURL + 'course/v1/user/enrollment/list'}/${userId}?fields=name,contentType,pkgVersion&batchDetails=name,createdBy,certificates`, appConfig).toPromise().catch(err => {
      logger.error({ msg: `Error occurred in getBatches() while fetching course error:  ${err}` });
    });
    logger.info({msg: `returning response from getUserEnrolledCourses for userId: ${userId} Data: ${_.get(response, 'data.result.courses')}`});

    let batchList = _.map(_.get(response, 'data.result.courses'), batch => {
      if (_.get(batch, 'courseId') === courseId) {
        batch.name = _.get(batch, 'batch.name');
        batch.createdBy = _.get(batch, 'batch.createdBy');
        return batch;
      }
    });
    batchList = _.compact(batchList);
    const courseData = {
        courseId: courseId,
        name: _.get(batchList, '[0].name'),
        contentType: _.get(batchList, '[0].content.contentType'),
        pkgVersion: _.get(batchList, '[0].content.pkgVersion'),
        batches: batchList
    }
    return courseData;
}

const addTemplateToBatch = () => {
  return async function (req, res, next) {
    try {
      logger.info({msg: `addTemplateToBatch() is called with requestbody ${JSON.stringify(req.body)}`});
        const criteria = _.get(req, 'body.request.criteria') || {};
        let templateData = {};
        if (!_.isEmpty(_.get(req, 'body.request.oldTemplateId'))) {
          const appConfig = getHeaders();
          appConfig.headers['x-authenticated-user-token'] = _.get(req, 'kauth.grant.access_token.token') || _.get(req, 'headers.x-authenticated-user-token');
          const requestParams = {
                batch: {
                  courseId: _.get(req, 'body.request.courseId'),
                  batchId: _.get(req, 'body.request.batchId'),
                  template: {
                    identifier: _.get(req, 'body.request.oldTemplateId'),
                  }
                }
          }
          const response = await HTTPService.patch(`${certRegURL + 'course/batch/cert/v1/template/remove'}`, {request: requestParams}, appConfig).toPromise().catch(err => {
            logger.error({msg: `Error occurred while removing certificate ${_.get(req, 'body.request.oldTemplateId')}, ERROR: ${err}`})
          });
          logger.info({msg: `response of removeTemplate from batch() ${_.get(response, 'data')}`});
        }
        if (!_.isEmpty(criteria)) {
          const response = await getTemplateData(req, _.pick(_.get(req, 'body.request'), ['orgId', 'key']));
          templateData =  _.get(response, 'data.result.response.data')
          templateData['criteria'] = criteria;
        } else {
          const response = await getTemplateData(req, _.pick(_.get(req, 'body.request'), ['orgId', 'key']));
          templateData =  _.get(response, 'data.result.response.data')
        }
        logger.info({msg: `returning success response from ${JSON.stringify(_.get(templateData, 'data.result.response.data'))}`});
        req.body.request['template'] = templateData;
        next();
    } catch(err) {
      logError(req, err, `Error occurred while fetching template ${JSON.stringify(req.body)}`);
      next(err);
    }
  }
}

const getTemplateData = async (req, requestParams) => {
  logger.info({msg: `getTemplateData() is called with ${requestParams}`});
  const appConfig = getHeaders();
  appConfig.headers['x-authenticated-user-token'] = _.get(req, 'kauth.grant.access_token.token') || _.get(req, 'headers.x-authenticated-user-token');
 const response = await HTTPService.post(`${certRegURL + 'org/v2/preferences/read'}`, {request: requestParams}, appConfig).toPromise();
  logger.info({msg: `returning response from getTemplateData() with data ${_.get(response, 'data')}`});
  return response;
}
/**
 * @description Removing the old attached certificate
 * While saving the new cert to an batch, we should remove the already attached cert
 * There should be only 1 certificate can be attached to an batch
 */
const removeCert = () => {
  return async function (req, res, next) {
    try {
        logger.info({msg: `removeCert() is called with requestbody ${JSON.stringify(req.body)}`});
        var reqObj = _.get(req, 'body.request');
        let oldTemplateId = _.get(reqObj, 'oldTemplateId')

        // In the request OldTemplateId is present then remove the attached old cert template
        if (!_.isEmpty(oldTemplateId)) {
          logger.info({msg: `Remove the old attached certificate ${oldTemplateId}`});
          const appConfig = getHeaders();
          appConfig.headers['x-authenticated-user-token'] = _.get(req, 'kauth.grant.access_token.token') || _.get(req, 'headers.x-authenticated-user-token');
          const requestParams = {
                batch: {
                  courseId: _.get(reqObj, 'batch.courseId'),
                  batchId: _.get(reqObj, 'batch.batchId'),
                  template: {
                    identifier: oldTemplateId,
                  }
                }
          }

          // Calling API to remove the attached certificate
          const response = await HTTPService.patch(`${certRegURL + 'course/batch/cert/v1/template/remove'}`, {request: requestParams}, appConfig).toPromise().catch(err => {
            logger.error({msg: `Error occurred while removing the old attached certificate ${oldTemplateId}, ERROR: ${err}`})
          });
        }
        next();
      }catch(err) {
        logError(req, err, `Error occurred while fetching template ${JSON.stringify(req.body)}`);
        next(err);
      }
    }
  }

module.exports = { getUserCertificates, addTemplateToBatch, removeCert };