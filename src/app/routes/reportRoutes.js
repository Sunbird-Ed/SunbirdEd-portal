const proxyUtils = require("../proxy/proxyUtils.js");
const reportHelper = require("../helpers/reportHelper.js");
const reports = require("../helpers/report/report");
const bodyParser = require("body-parser");
const BASE_REPORT_URL = "/report";

module.exports = function (app) {
  app.use(
    BASE_REPORT_URL,
    proxyUtils.verifyToken(),
    reportHelper.validateRoles(["REPORT_VIEWER"]),
    bodyParser.json({ limit: "1mb" }),
    reports
  );

  app.get(
    "/courseReports/:slug/:filename",
    proxyUtils.verifyToken(),
    reportHelper.validateRoles(["CONTENT_CREATOR"]),
    reportHelper.azureBlobStream()
  );

  app.get(
    "/reports/:slug/:filename",
    proxyUtils.verifyToken(),
    // reportHelper.validateSlug(['public']),
    // reportHelper.validateRoles(['ORG_ADMIN', 'REPORT_VIEWER']),
    reportHelper.azureBlobStream()
  );

  app.get(
    "/admin-reports/:slug/:filename",
    proxyUtils.verifyToken(),
    reportHelper.validateSlug([
      "geo-summary",
      "geo-detail",
      "geo-summary-district",
      "user-summary",
      "user-detail",
      "validated-user-summary",
      "validated-user-summary-district",
      "validated-user-detail",
    ]),
    reportHelper.validateRoles(["ORG_ADMIN"]),
    reportHelper.azureBlobStream()
  );
};
