const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')
const BASE_REPORT_URL = "/report";
const proxy = require('express-http-proxy');
const {REPORT_SERVICE_URL, sunbird_api_request_timeout, DATASERVICE_URL,CONTENT_URL, sunbird_data_product_service} = require('../helpers/environmentVariablesHelper.js');
const reqDataLimitOfContentUpload = '50mb';
const _ = require('lodash');
const {getUserDetailsV2} = require('../helpers/userHelper');

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
    
    app.all(['/report/request/read/:tag', '/report/request/list/:tag', '/report/request/submit'],
    proxyUtils.verifyToken(),
    proxy(sunbird_data_product_service, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.overRideRequestHeaders(sunbird_data_product_service, {'X-Channel-Id': true}),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/report/', 'api/dataset/v1/');
        let query = require('url').parse(req.url).query;
        if (query) {
          return require('url').parse(sunbird_data_product_service + urlParam).path
        } else {
          return require('url').parse(sunbird_data_product_service + urlParam).path
        }
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

  app.all(['/report/v1/collection/summary'],
    proxyUtils.verifyToken(),
    proxy(CONTENT_URL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(CONTENT_URL),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/report/', '');
        let query = require('url').parse(req.url).query;
        if (query) {
          return require('url').parse(CONTENT_URL + urlParam + '?' + query).path
        } else {
          return require('url').parse(CONTENT_URL + urlParam).path
        }
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
    )
}
