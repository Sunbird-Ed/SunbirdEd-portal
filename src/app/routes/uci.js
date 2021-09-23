const proxyUtils = require("../proxy/proxyUtils.js");
const BASE_REPORT_URL = "/uci/admin";
const proxy = require("express-http-proxy");
const {
  uci_service_base_url,
} = require("../helpers/environmentVariablesHelper.js");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bodyParser = require("body-parser");
const dateFormat = require("dateformat");
const { logger } = require("@project-sunbird/logger");
const isAPIWhitelisted = require("../helpers/apiWhiteList");

module.exports = function (app) {
  app.get(
    `${BASE_REPORT_URL}/v1/bot/get`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/search'`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/pause/:botId`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/start/:botId`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/delete/:botId`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/get/:id`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/getByParam`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/bot/create`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/bot/update/:id`,
    proxyUtils.verifyToken(),
    proxyObject()
  );

  app.get(
    `${BASE_REPORT_URL}/v1/userSegment/get`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/userSegment/search`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/userSegment/create`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/userSegment/queryBuilder`,
    proxyUtils.verifyToken(),
    proxyObject()
  );

  app.post(
    `${BASE_REPORT_URL}/v1/conversationLogic/create`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/conversationLogic/update/:id`,
    proxyUtils.verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/conversationLogic/delete/:id`,
    proxyUtils.verifyToken(),
    proxyObject()
  );

  app.post(
    `${BASE_REPORT_URL}/v1/forms/upload`,
    proxyUtils.verifyToken(),
    proxyObject()
  );

  app.post(`/v1/graphql`, proxyUtils.verifyToken(), proxyObject());
};

function addHeaders() {
  return function (proxyReqOpts, srcReq) {
    return proxyUtils.decorateRequestHeaders(uci_service_base_url)();
  };
}

function proxyObject() {
  console.error("ProxyObject inside UCI called");
  return proxy(uci_service_base_url, {
    proxyReqOptDecorator: addHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl;
      console.log("Request coming from :", urlParam);
      let query = require("url").parse(req.url).query;
      if (query) {
        return require("url").parse(
          uci_service_base_url + urlParam + "?" + query
        ).path;
      } else {
        return require("url").parse(uci_service_base_url + urlParam).path;
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      try {
        const data = JSON.parse(proxyResData.toString("utf8"));
        if (
          req.method === "GET" &&
          proxyRes.statusCode === 404 &&
          typeof data.message === "string" &&
          data.message.toLowerCase() ===
            "API not found with these values".toLowerCase()
        )
          res.redirect("/");
        else
          return proxyUtils.handleSessionExpiry(
            proxyRes,
            proxyResData,
            req,
            res,
            data
          );
      } catch (err) {
        logger.error({ message: err });
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    },
  });
}
