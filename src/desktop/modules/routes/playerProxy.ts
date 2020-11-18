import { logger } from "@project-sunbird/logger";
const proxy = require('express-http-proxy');

export default (app, proxyURL) => {
    app.use(
        "/content-plugins/*",
        proxy(proxyURL, {
          proxyReqPathResolver(req) {
            logger.debug(
              `ReqId = "${req.headers["X-msgid"]}": Parsing content-plugin urls`,
            );
            return require("url").parse(proxyURL + req.originalUrl).path;
          },
        }),
      );
  
      app.use(
        "/assets/public/*",
        proxy(proxyURL, {
          proxyReqPathResolver(req) {
            logger.debug(
              `ReqId = "${req.headers["X-msgid"]}": Parsing assets/public urls`,
            );
            return require("url").parse(proxyURL + req.originalUrl).path;
          },
        }),
      );
  
      app.use(
        "/contentPlayer/preview/*",
        proxy(proxyURL, {
          proxyReqPathResolver(req) {
            logger.debug(
              `ReqId = "${req.headers["X-msgid"]}": Parsing contentPlayer/preview/ urls`,
            );
            return require("url").parse(proxyURL + req.originalUrl).path;
          },
        }),
      );
}