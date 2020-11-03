Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@project-sunbird/logger");
const response_1 = require("./../utils/response");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
class Tenant {
    get(req, res) {
        const resObj = {
            appLogo: "/appLogo.png",
            favicon: "/favicon.ico",
            logo: "/logo.svg",
            titleName: process.env.APP_NAME,
        };
        logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Received Tenant Info`);
        res.send(response_1.default.success("api.tenant.info", resObj, req));
    }
}
exports.default = Tenant;
