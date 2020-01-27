const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')

module.exports = function (app) {

    app.get('/courseReports/:slug/:filename',
        reportHelper.validateRoles(['CONTENT_CREATOR']),
        reportHelper.azureBlobStream());

    app.get('/reports/:slug/:filename',
        reportHelper.validateSlug(['public']),
        reportHelper.validateRoles(['ORG_ADMIN', 'REPORT_VIEWER']),
        reportHelper.azureBlobStream());

    app.get('/admin-reports/:slug/:filename',
        reportHelper.validateSlug(),
        reportHelper.validateRoles(['ORG_ADMIN']),
        reportHelper.azureBlobStream());
}
