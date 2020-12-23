import { logger } from "@project-sunbird/logger";
import Response from "../utils/response";

import { ClassLogger } from "@project-sunbird/logger/decorator";

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
export default class Tenant {
  public get(req, res) {
    const resObj = {
      appLogo: "assets/images/appLogo.png",
      favicon: "assets/images/favicon.ico",
      logo: "assets/images/logo.svg",
      titleName: process.env.APP_NAME,
    };
    logger.info(`ReqId = "${req.headers["X-msgid"]}": Received Tenant Info`);
    res.send(Response.success("api.tenant.info", resObj, req));
  }
}
