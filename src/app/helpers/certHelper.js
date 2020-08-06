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

  const courseData = await getCreatorBatches(req, courseId, currentUser, _.get(userData, 'identifier'))
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


const getCreatorBatches = async (req, courseId, currentUser, userId) => {
  logger.info({ msg: `getCreatorBatches() is called with ${courseId}, currentUser ${currentUser} userId: ${userId} with url: ${certRegURL + 'content/v1/read'}` });
  const requestParams = {
      request: {
        filters: {
          courseId: courseId,
          createdBy:  currentUser,
          status: ['0', '1', '2']
        },
        sort_by: {
          createdDate: 'desc'
        }
      }
  };
  logger.info({ msg: `HTTPService is called in  getBatchList() of current user with ${certRegURL + 'course/v1/batch/list'}` });
  const response = await HTTPService.post(`${certRegURL + 'course/v1/batch/list'}`, requestParams, getHeaders()).toPromise().catch(err => {
    logger.error({ msg: `Error occurred in batchList() while fetching course error:  ${err}` });	
  });

  const creatorBatches = _.get(response, 'data.result.response.content');
  const enrolledBatches = await getUserEnrolledCourses(req, userId);
  const data = filterUserBatches(courseId, creatorBatches, enrolledBatches);
  logger.info({msg: `returning response from getCreatorBatches for courseId: ${courseId}, currentUser ${currentUser} userId: ${userId} Data: ${creatorBatches}`})

  return data ;
}

const getUserEnrolledCourses = async (req, userId) => {
  logger.info({ msg: `getUserEnrolledCourses() is called with userId ${userId}` });
    const appConfig = getHeaders();
    appConfig.headers['x-authenticated-user-token'] = _.get(req, 'kauth.grant.access_token.token') || _.get(req, 'headers.x-authenticated-user-token');
    const response = await HTTPService.get(`${certRegURL + 'course/v1/user/enrollment/list'}/${userId}`, appConfig).toPromise().catch(err => {
      logger.error({ msg: `Error occurred in getBatches() while fetching course error:  ${err}` });
    });
    logger.info({msg: `returning response from getUserEnrolledCourses for userId: ${userId} Data: ${_.get(response, 'data.result.courses')}`})
    return _.get(response, 'data.result.courses');
}

const filterUserBatches = (courseId, creatorBatches, enrolledBatches) => {
  logger.info({ msg: `filterUserBatches() is called with courseId ${courseId}` });

  let courseData = {};
  for (let batch of enrolledBatches) {
        if (batch) {
          if (_.isEqual(_.get(batch, 'courseId'), courseId)) {
              courseData = {
                courseId: _.get(batch, 'courseId'),
                name: _.get(batch, 'content.name'),
                contentType: _.get(batch, 'content.contentType'),
                pkgVersion: _.get(batch, 'content.pkgVersion'),
                batches: [],
              };
            const creatorBatch = _.find(creatorBatches, {batchId: _.get(batch, 'batchId')});
              if (creatorBatch) {
                batch.createdBy = _.get(creatorBatch, 'createdBy');
                batch.progress =  _.get(batch, 'progress') > 0 ? (_.get(batch, 'progress') === _.get(batch, 'leafNodesCount') ? 2 : 1) : 0;
                batch.name = _.get(creatorBatch, 'name');
                courseData.batches.push(_.omit(batch, 'content'));
              }
          }
        }
  }
  logger.info({msg: `returning response from filterUserBatches for courseId: ${courseId} Data: ${JSON.stringify(courseData)}`})
  return courseData;
}
module.exports = { getUserCertificates };