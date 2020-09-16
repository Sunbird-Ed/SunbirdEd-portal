const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')
const BASE_REPORT_URL = "/report";
const proxy = require('express-http-proxy');
const {REPORT_SERVICE_URL, sunbird_api_request_timeout, DATASERVICE_URL, PORTAL_API_AUTH_TOKEN, sunbird_device_api} = require('../helpers/environmentVariablesHelper.js');
const reqDataLimitOfContentUpload = '50mb';
const _ = require('lodash');
const {getUserDetailsV2} = require('../helpers/userHelper');
const CONSTANTS = require('../helpers/constants');
const {sendRequest} = require('../helpers/httpRequestHandler');
const httpSatusCode = require('http-status-codes');
const {logger} = require('@project-sunbird/logger');
const uuidv1 = require('uuid/v1');
const {parseJson} = require('../helpers/utilityService');

module.exports = function (app) {
    app.all([`${BASE_REPORT_URL}/update/:reportId`, `${BASE_REPORT_URL}/publish/:reportId`, `${BASE_REPORT_URL}/publish/:reportId/:hash`, `${BASE_REPORT_URL}/retire/:reportId`, `${BASE_REPORT_URL}/retire/:reportId/:hash`],
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_ADMIN']),
        proxy(REPORT_SERVICE_URL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(REPORT_SERVICE_URL),
            proxyReqPathResolver: function (req) {
                return `${REPORT_SERVICE_URL}${req.originalUrl}`
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
                } catch (err) {
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
                }
            }
        })
    )
    app.all([`${BASE_REPORT_URL}/list`, `${BASE_REPORT_URL}/get/:reportId`],
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_VIEWER', 'REPORT_ADMIN']),
        proxy(REPORT_SERVICE_URL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(REPORT_SERVICE_URL),
            proxyReqPathResolver: function (req) {
                return `${REPORT_SERVICE_URL}${req.originalUrl}`
            },
            userResDecorator: async (proxyRes, proxyResData, req, res) => {
                try {
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    const { reports, count } = _.get(data, 'result');
                    if (count === 0) return proxyResData;
                    var token = _.get(req, 'kauth.grant.access_token.token');
                    const user = await getUserDetailsV2(req.session.userId, token);
                    const filteredReports = reportHelper.getReports(reports, user);
                    data.result.reports = filteredReports;
                    data.result.count = filteredReports.length;
                    return JSON.stringify({ ...data });
                } catch (err) {
                    console.log(err);
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
                }
            }
        })
    )
    app.all([`${BASE_REPORT_URL}/get/:reportId/:hash`, `${BASE_REPORT_URL}/summary/*`],
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_VIEWER', 'REPORT_ADMIN']),
        proxy(REPORT_SERVICE_URL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(REPORT_SERVICE_URL),
            proxyReqPathResolver: function (req) {
                return `${REPORT_SERVICE_URL}${req.originalUrl}`
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
                } catch (err) {
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
                }
            }
        })
    )
    app.get('/courseReports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['CONTENT_CREATOR']),
        reportHelper.azureBlobStream());
    app.get('/course-reports/metadata',
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['CONTENT_CREATOR', 'REPORT_VIEWER', 'REPORT_ADMIN', 'ORG_ADMIN']),
        reportHelper.getLastModifiedDate);
    app.get(`/reports/fetch/:slug/:filename`,
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_VIEWER', 'REPORT_ADMIN']),
        reportHelper.azureBlobStream());
    app.get('/reports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateSlug(['public']),
        reportHelper.validateRoles(['ORG_ADMIN', 'REPORT_VIEWER', 'REPORT_ADMIN']),
        reportHelper.azureBlobStream());
    app.get('/admin-reports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateSlug(['geo-summary', 'geo-detail', 'geo-summary-district', 'user-summary', 'user-detail',
            'validated-user-summary', 'validated-user-summary-district', 'validated-user-detail', 'declared_user_detail']),
        reportHelper.validateRoles(['ORG_ADMIN']),
        reportHelper.azureBlobStream());
    app.get(`${BASE_REPORT_URL}/dataset/get/:datasetId`,
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_ADMIN']),
        proxy(DATASERVICE_URL, {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(DATASERVICE_URL),
            proxyReqPathResolver: function (req) {
                const updatedUrl = req.originalUrl.replace("/report", "");
                return `/api/data/v3${updatedUrl}`;
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                try {
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
                } catch (err) {
                    return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
                }
            }
        })
    );

    app.get('/report/job/request/read/:tag/:requestId', async (req, res) => {
      const tag = req.params.tag;
      const requestId = req.params.requestId;
      var options = {
        method: CONSTANTS.HTTP.METHOD.GET,
        'url': sunbird_device_api + '/data/' + CONSTANTS.API_VERSION.V3 + '/job/request/read/test-tag/A09115FCBEC94CE6ACEB4D9BBFDBCBCF',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTU4MzIyNzkyMTE0MWJiYWE0MjA4ZTBkMjE3YmU0ZiJ9.t2OPiAMuongqwSQfdJAsokgt2Eur5t7RchNZmWOwNTg',//PORTAL_API_AUTH_TOKEN,
          'X-Channel-ID': 'in.ekstep', // should be dynamic
        }
      };
      try {
        const responseData = await sendRequest(options);
        res.status(httpSatusCode.OK).send(parseJson(responseData))
      } catch (e) {
        logger.error({msg: 'reportRoutes:fetching report details errored', errorMessage: e.message, error: e});
        res.status(httpSatusCode.INTERNAL_SERVER_ERROR).send({
          "id": "api.report.details",
          "ver": CONSTANTS.API_VERSION.V3,
          "ts": new Date(),
          "params": {
            "resmsgid": uuidv1(),
            "msgid": uuidv1(),
            "err": "INTERNAL_SERVER_ERROR",
            "status": "INTERNAL_SERVER_ERROR",
            "errmsg": e.message
          },
          "responseCode": "INTERNAL_SERVER_ERROR",
          result: {
            error: e
          }
        });
      }
    });

  app.get('/report/job/list/:tag', async (req, res) => {
    let errType;
    try {
      if (!req.params.tag ) {
        errType = 'MANDATORY_PARAMS_MISSING';
        throw 'tag is mandatory parameter missing';
      }
      var options = {
        method: CONSTANTS.HTTP.METHOD.GET,
        // TODO: get params
        'url': sunbird_device_api + '/data/' + CONSTANTS.API_VERSION.V3 + '/job/request/list/' + /*req.params.tag ||*/ 'test-tag',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTU4MzIyNzkyMTE0MWJiYWE0MjA4ZTBkMjE3YmU0ZiJ9.t2OPiAMuongqwSQfdJAsokgt2Eur5t7RchNZmWOwNTg', //+ PORTAL_API_AUTH_TOKEN,
          'X-Channel-ID': 'in.ekstep', // should be dynamic
        }
      };
      errType = 'FETCH_JOB_REQUEST';
      const responseData = await sendRequest(options);
      errType = 'PARSE_JSON';
      res.status(httpSatusCode.OK).send(parseJson(responseData))
    } catch (e) {
      logger.error({
        msg: 'reportRoutes:fetching list of report errored',
        errorMessage: e.message,
        error: e,
        errType: errType
      });
      res.status(httpSatusCode.INTERNAL_SERVER_ERROR).send({
        "id": "api.report.details",
        "ver": CONSTANTS.API_VERSION.V3,
        "ts": new Date(),
        "params": {
          "resmsgid": uuidv1(),
          "msgid": uuidv1(),
          "err": "INTERNAL_SERVER_ERROR",
          "status": "INTERNAL_SERVER_ERROR",
          "errmsg": e.message
        },
        "responseCode": "INTERNAL_SERVER_ERROR",
        result: {
          error: e
        }
      });
    }
  })
};
