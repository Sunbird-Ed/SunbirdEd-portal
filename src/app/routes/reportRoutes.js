const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')
const BASE_REPORT_URL = "/report/report";
const proxy = require('express-http-proxy');
const { REPORT_SERVICE_URL } = require('../helpers/environmentVariablesHelper.js');

module.exports = function (app) {


    app.all([`${BASE_REPORT_URL}/list`, `${BASE_REPORT_URL}/get/:reportId`],
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_VIEWER', 'REPORT_ADMIN']),
        proxy(REPORT_SERVICE_URL)
    )

    app.get('/courseReports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['CONTENT_CREATOR']),
        reportHelper.azureBlobStream());

    app.get(`/reports/fetch/:slug/:filename`,
        proxyUtils.verifyToken(),
        reportHelper.validateRoles(['REPORT_VIEWER', 'REPORT_ADMIN']),
        reportHelper.azureBlobStream());

    app.get('/reports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateSlug(['public']),
        reportHelper.validateRoles(['ORG_ADMIN', 'REPORT_VIEWER']),
        reportHelper.azureBlobStream());

    app.get('/admin-reports/:slug/:filename',
        proxyUtils.verifyToken(),
        reportHelper.validateSlug(['geo-summary', 'geo-detail', 'geo-summary-district', 'user-summary', 'user-detail',
            'validated-user-summary', 'validated-user-summary-district', 'validated-user-detail']),
        reportHelper.validateRoles(['ORG_ADMIN']),
        reportHelper.azureBlobStream());
}
