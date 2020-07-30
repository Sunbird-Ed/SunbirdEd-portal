const { HTTPService } = require('@project-sunbird/ext-framework-server/services');
const envHelper = require('./environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const logger = require('sb_logger_util_v2')
const _ = require('lodash')

var certRegServiceApi = {
    searchCertificate : 'certreg/v1/certs/search',
    getCourse: 'content/v1/read',
  };

// To get Certificate details and course details
  const getUserCertificates = async (data, courseId) =>  {
    logger.debug({msg: 'getUserCertificates() is called'});
    const userData = _.get(data, 'result.response.content[0]');
    const options = {
      request: {
        _source: [],
        query: {
          bool: {
            must: [
              {
                match_phrase: {
                  'recipient.id': _.get(userData, 'identifier'),
                },
              }
            ]
          }
        }
      }
    };

    const appConfig = {
      headers: {
        authorization: `Bearer ${envHelper.PORTAL_API_AUTH_TOKEN}`,
        'content-type': 'application/json',
      },
    };
    logger.info({msg: `searchCertificate HTTP request is called to get certificates for userId: ${_.get(userData, 'identifier')}`});
    let certList = await HTTPService.post( certRegURL + certRegServiceApi.searchCertificate, options, appConfig ).toPromise();

    certList = _.get(certList, 'data.result.response.content');
    logger.info({msg: `getCourse HTTP request is called to get coursedata for courseId: ${courseId}`});

    const response = await HTTPService.get( `${certRegURL + certRegServiceApi.getCourse}/${courseId}`, {} ).toPromise();
  
    const courses = getCertList ([_.get(response, 'data.result.content')], certList);
    const resObj = {
        userId: _.get(userData, 'identifier'),
        userName: _.get(userData, 'userName'),
        courses: _.compact(courses)
    };
    logger.info({msg: `returning response from getUserCertificates() ${resObj}`});

    return  resObj;
  }

  // To get Certificate details and course details
  const getCertList =  (courses, certList)  => {
    logger.debug({msg: `getCertList() is called with course[]  and cert[]`});
    const courseList = [];
    _.forEach (courses, course => {
      const courseId = _.get(course, 'identifier');

      const existingCourse = _.find(courseList, {courseId: courseId});

      let batchList = existingCourse ? _.get(existingCourse, 'batches') : _.get(course, 'batches');
        batchList = !_.isEmpty(batchList) ? isJSON(batchList) : [] ;

      const batches = _.map(certList, cert => {
      const batch = _.find(batchList, {batchId: _.get(cert, '_source.related.batchId')});
        if (batch) {
          batch.hasOwnProperty('certificates') ? batch.certificates.push(_.omit(cert, ['_index', '_type'])) : batch.certificates = [_.omit(cert, ['_index', '_type'])];
          return batch;
        }
        });
        courseList.push({
            courseId: _.get(course, 'identifier'),
            courseName: _.get(course, 'name'),
            batches: _.compact(batches)
        });
    });
    logger.info({msg: `returning courseList with batches and certificates from getCertList(), ${JSON.stringify(courseList)}`});
    return courseList;
  }


  isJSON = (batches) => {
    let parsedBatches = [];
    logger.debug({msg: `isJSON() is called `});
    try {
      parsedBatches = JSON.parse(batches);
    } catch (e) {
      parsedBatches = batches;
    }
    logger.info({msg: `returning parsed JSON from isJSON() ${parsedBatches}`});
    return parsedBatches;
  }

  module.exports = { getUserCertificates };