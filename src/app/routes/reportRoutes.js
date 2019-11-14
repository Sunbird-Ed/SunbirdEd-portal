const proxyUtils = require('../proxy/proxyUtils.js')
const reportHelper = require('../helpers/reportHelper.js')

module.exports = function (app) {
    app.get('/reports/:slug/:filename',
        reportHelper.isValidSlug(['ORG_ADMIN','REPORT_VIEWER']),
        reportHelper.azureBlobStream());
    app.get('/admin-reports/:slug/:filename',
        reportHelper.isValidSlug(['ORG_ADMIN']),
        reportHelper.azureBlobStream());
}
