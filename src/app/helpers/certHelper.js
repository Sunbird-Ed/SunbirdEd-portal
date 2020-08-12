const { HTTPService } = require('@project-sunbird/ext-framework-server/services');
const envHelper = require('./environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const logger = require('sb_logger_util_v2')
const _ = require('lodash')

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

  let district = await getDistrictName(req, requestParams);

  if (_.isEmpty(district) && _.get(userData, 'locationIds') && _.get(userData, 'locationIds').length > 1) {
    requestParams.request.filters.id = _.get(userData, 'locationIds[1]');
    district = await getDistrictName(req, requestParams);
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
module.exports = { getUserCertificates };