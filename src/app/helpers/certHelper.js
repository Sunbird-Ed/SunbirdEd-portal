const { HTTPService } = require('@project-sunbird/ext-framework-server/services');
const envHelper = require('./environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const logger = require('sb_logger_util_v2')

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
              },
            ],
          },
        },
      },
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

  const getCertList =  (courses, certList)  => {
    logger.debug({msg: `getCertList() is called with course[]  and cert[]`});
    const courseList = [];
    _.forEach (courses, course => {
      const batchList = _.get(course, 'batches') ?  isJSON(_.get(course, 'batches')) : [] ;
        const batches = _.map(certList, cert => {
            const batch = _.find(batchList, {batchId: _.get(cert, '_source.related.batchId')});
            if (batch) {
                batch.certificate = _.omit(cert, ['_index', '_type']);
                return batch;
            }
        });
        courseList.push({
            courseId: _.get(course, 'identifier'),
            courseName: _.get(course, 'name'),
            batches: _.compact(batches)
        });
    });
    logger.info({msg: `returning courseList with batches and certificates , ${courseList}`});
    return courseList;
  }


  isJSON = (batches) => {
    logger.debug({msg: `isJSON() is called`});
    try {
        return JSON.parse(batches);
    } catch (e) {
        logger.error({msg: `Error occured in isJSON, ${e}`});
        return batches;
    }
  }

  module.exports = { getUserCertificates };