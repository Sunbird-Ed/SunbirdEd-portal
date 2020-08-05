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

  const courseData = await getCourseData(req, courseId, _.get(userData, 'identifier'), currentUser);

  const resObj = {
    userId: _.get(userData, 'identifier'),
    userName: _.get(userData, 'userName'),
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

const getCourseData = async (req, courseId, userId, currentUser) => {
  logger.info({ msg: `getCourseData() is called with ${courseId} with url: ${certRegURL + 'content/v1/read'}` });
  const response = await HTTPService.get(`${certRegURL + 'content/v1/read'}/${courseId}`, {}).toPromise().catch(err => {
    logger.error({ msg: `Error occurred in getCourseData() while fetching course error:  ${err}` });
  });
  // logger.info({ msg: `returning data from getCourseData() with${JSON.stringify(_.get(response, 'data.result.content'))}` });
  const courseData = _.get(response, 'data.result.content');
  const batchList = await getBatches(req, courseData, _.get(courseData, 'batches'), userId, currentUser);
  return (
    {
      courseId: _.get(courseData, 'identifier'),
      name: _.get(courseData, 'name'),
      contentType: _.get(courseData, 'contentType'),
      pkgVersion: _.get(courseData, 'pkgVersion'),
      batches: _.compact(batchList)
    }
  );
}


const getBatches = async (req, courseData, batchList, userId, currentUser) => {
  const courseId = _.get(courseData, 'identifier');
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

  batchList = _.get(response, 'data.result.response.content');
  let batches = [];
  let certList = [];
  certList = await getCertList(req, userId);
  batchList = !_.isEmpty(batchList) ? isJSON(batchList) : [];
  for (let cert of certList) {
    let batch = {};
    if (!_.isEmpty(batches)) {
      batch = _.find(batches, { batchId: _.get(cert, '_source.related.batchId') });
      if (batch && courseId === _.get(cert, '_source.related.courseId')) {
        batch.certificates.push(cert);
      }
    } else {
      batch = _.find(batchList, { batchId: _.get(cert, '_source.related.batchId') });
      if (batch) {
        batch.progress = await getBatchProgress(req, userId, _.get(batch, 'batchId'), courseData);
        batch['certificates'] = (courseId === _.get(cert, '_source.related.courseId')) ? [cert] : [];
      }
    }
    batches.push(batch);
  };
  return _.uniqBy(batches, 'batchId');
}

const getCertList = async (req, userId) => {
  logger.info({ msg: `getCertList() is called with ${userId}` });
  const options = {
    request: {
      _source: [],
      query: {
        bool: {
          must: [
            {
              match_phrase: {
                'recipient.id': userId,
              },
            }
          ]
        }
      }
    }
  };
  logger.info({ msg: `searchCertificate HTTP request is called to get certificates for userId: ${userId}, with url ${certRegURL + 'certreg/v1/certs/search'}` });
  let response = await HTTPService.post(certRegURL + 'certreg/v1/certs/search', options, getHeaders()).toPromise().catch(err => {
    logger.error({ msg: `Error occurred in  getUserCertificates() while fetching certificates error :  ${err}` });
  });

  logger.info({ msg: `getCertList() is returning data with ${JSON.stringify(_.get(response, 'data.result.response.content'))}` })
  return _.get(response, 'data.result.response.content') || [];
}

const getBatchProgress = async (req, userId, batchId, course) => {
  logger.info({ msg: `getBatchProgress() is called with ${userId, batchId, course}` });
    let contentIds = _.get(course, 'leafNodes') || [];
    if (_.isEmpty(contentIds)) {
      const model = new TreeModel();
      const treeModel = model.parse(course);
      treeModel.walk((node) => {
        if (node.model.mimeType === 'application/vnd.ekstep.content-collection') {
          contentIds.push(_.get(node.model, 'identifier'));
        }
      });
    }

    const options = {
      request: {
        userId: userId,
        batchId: batchId,
        contentIds: _.compact(contentIds),
        courseId: _.get(course, 'identifier')
      }
    };

    const appConfig = getHeaders();
    appConfig.headers['x-authenticated-user-token'] = _.get(req, 'kauth.grant.access_token.token');
  
    logger.info({ msg: `HTTPService is called in  getBatchProgress() with ${certRegURL + 'course/v1/content/state/read'}` });
    const response = await HTTPService.post(certRegURL + 'course/v1/content/state/read', options, appConfig).toPromise().catch(err => {
      logger.error({ msg: `Error occurred in  getBatchProgress() Error: , ${err}` });
    });

    let progress = 0;
    _.forEach(_.get(response, 'data.result.contentList'), (content) => {
      progress += _.get(content, 'progress');
    });
    logger.info({ msg: `getBatchProgress() is returning with progress  ${progress} for batch: ${batchId}` });
    return !_.isEmpty(contentIds) ? (progress / (contentIds.length * 100)) * 100: 0;
}

module.exports = { getUserCertificates };