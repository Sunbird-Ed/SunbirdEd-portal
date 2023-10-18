const proxyUtils = require("../proxy/proxyUtils.js");
const BASE_REPORT_URL = "/uci/admin";
const BASE_REPORT_URL_GRAPHQL = "/uci-api/gql";
const proxy = require("express-http-proxy");
const utils = require('../helpers/utils.js');
const uci_service_base_url = utils?.defaultHost(utils?.envVariables?.uci_service_base_url);
const { logger } = require("@project-sunbird/logger");
// TODO: remove this hack for Local dev
let verifyToken;
if (process.env.sunbird_environment !== "local") {
  verifyToken = proxyUtils.verifyToken;
} else {
  verifyToken = () => (req, res, next) => next();
}

console.log("[INSIDE UCI]", process.env.sunbird_environment !== "local", {
  verifyToken,
});

module.exports = function (app) {
  app.get(`${BASE_REPORT_URL}/v1/bot/get`, verifyToken(), proxyObject());
  app.get(`${BASE_REPORT_URL}/v1/bot/search`, verifyToken(), proxyObject());
  app.get(
    `${BASE_REPORT_URL}/v1/bot/pause/:botId`,
    verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/start/:botId`,
    verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/bot/delete/:botId`,
    verifyToken(),
    proxyObject()
  );
  app.get(`${BASE_REPORT_URL}/v1/bot/get/:id`, verifyToken(), proxyObject());
  app.get(`${BASE_REPORT_URL}/v1/bot/getByParam`, verifyToken(), proxyObject());
  app.post(`${BASE_REPORT_URL}/v1/bot/create`, verifyToken(), proxyObject());
  app.post(
    `${BASE_REPORT_URL}/v1/bot/update/:id`,
    verifyToken(),
    proxyObject()
  );
  app.get(`${BASE_REPORT_URL}/v1/userSegment/get`, proxyObject());
  app.get(
    `${BASE_REPORT_URL}/v1/userSegment/search`,
    verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/userSegment/create`,
    verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/userSegment/queryBuilder`,
    verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/conversationLogic/create`,
    verifyToken(),
    proxyObject()
  );
  app.post(
    `${BASE_REPORT_URL}/v1/conversationLogic/update/:id`,
    verifyToken(),
    proxyObject()
  );
  app.get(
    `${BASE_REPORT_URL}/v1/conversationLogic/delete/:id`,
    verifyToken(),
    proxyObject()
  );
  app.post(`${BASE_REPORT_URL}/v1/forms/upload`, verifyToken(), proxyObject());
  app.post(`${BASE_REPORT_URL_GRAPHQL}`, verifyToken(), proxyObject());
};

function addHeaders() {
  return function (proxyReqOpts, srcReq) {
    return proxyUtils.decorateRequestHeaders(uci_service_base_url);
  };
}

function proxyObject() {
  return proxy(uci_service_base_url, {
    proxyReqOptDecorator:
      proxyUtils.decorateRequestHeaders(uci_service_base_url),
    proxyReqPathResolver: function (req) {
      return require("url").parse(uci_service_base_url + req.originalUrl).path;
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
