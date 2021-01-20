import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import * as url from "url";
import config from "./../config";
import Content from "./../controllers/content/content";
import { Faqs } from "./../controllers/faqs";
import { Location } from "./../controllers/location";
import { ResourceBundle } from "./../controllers/resourceBundle";
import Tenant from "./../controllers/tenant";
import { manifest } from "./../manifest";
const proxy = require('express-http-proxy');
import Response from "./../utils/response";
import { decorateRequestHeaders } from "../helper/proxyUtils";
import User from "../controllers/user";

export default (app, proxyURL) => {
    const content = new Content(manifest);
    const resourcebundle = new ResourceBundle(manifest);
    app.get(["/resourcebundles/v1/read/:id", "/resourcebundles/v1/readLang/:id"], (req, res) => {
        resourcebundle.get(req, res);
    });
   

    const faqs = new Faqs(manifest);
    app.get("/api/faqs/v1/read/:language", faqs.read.bind(faqs));
    

    const tenant = new Tenant();
    app.get(
        ["/v1/tenant/info/", "/v1/tenant/info/:id"],
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/v1/tenant/info/`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`Error While getting tenant info data from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    resolve(proxyResData);
                });
            }
        }),
        (req, res) => {
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Get tenant Info from local`);
            tenant.get(req, res);
            return; 
        }
    );

    const location = new Location(manifest);
    app.post(
        "/learner/data/v1/location/search", location.proxyToAPI.bind(location), location.search.bind(location),
    );
    app.post(
        "/learner/data/v1/location/save", location.saveLocation.bind(location),
    );
    app.get("/learner/data/v1/location/read", location.get.bind(location));

    app.get("/learner/data/v1/system/settings/get/custodianOrgId", (req, res) => {
        const resObj = {
            response: {
                id: "custodianOrgId",
                field: "custodianOrgId",
                value: process.env.CUSTODIAN_ORG,
            },
        };

        return res.send(Response.success("api.system.settings.get.custodianOrgId", resObj, req));
    });

    app.get("/learner/data/v1/system/settings/*", proxy(proxyURL, {
        proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
        proxyReqPathResolver: (req) => {
            return require('url').parse(proxyURL + req.originalUrl.replace('/learner/', '/api/')).path
        }
    }));

    app.post(`/api/data/v1/dial/assemble`,
        (req, res, next) => {
            if (enableProxy(req)) {
                req = updateRequestBody(req);
                next();
            } else {
                content.searchDialCode(req, res);
                return;
            }
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/data/v1/dial/assemble`;
            },
            userResDecorator(proxyRes, proxyResData, req) {
                return new Promise(function (resolve) {
                    const proxyData = content.convertBufferToJson(proxyResData, req);
                    const sections = _.get(proxyData, "result.response.sections");
                    if (!_.isEmpty(_.get(sections[0], `contents`))) {
                        content
                            .decorateDialSearchContents(sections, req.headers["X-msgid"])
                            .then((data) => {
                                proxyData.result.response.sections = data;
                                resolve(proxyData);
                            })
                            .catch((err) => {
                                resolve(proxyData);
                            });
                    } else {
                        resolve(proxyData);
                    }
                });
            },
        }));
    
    app.get(
        "/getGeneralisedResourcesBundles/:lang/:fileName",
        (req, res, next) => {
            logger.debug(`Received API call to read generalise resourse bundle`);
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            next();
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/getGeneralisedResourcesBundles/${req.params.lang}/${req.params.fileName}`;
            },
        }),
    );

    const user = new User(manifest);
    app.get("/api/desktop/user/v1/read",
      user.read.bind(user),
    );
}

const enableProxy = (req) => {
    logger.debug(`ReqId = "${req.headers["X-msgid"]}": Checking the proxy`);
    let flag = false;
    if (req.get("referer")) {
        const refererUrl = new url.URL(req.get("referer"));
        const pathName = refererUrl.pathname;
        flag = !_.startsWith(pathName, "/mydownloads");
    }
    return flag;
};

const updateRequestBody = (req) => {
    logger.debug(
        `ReqId = "${req.headers["X-msgid"]}": Updating request body filters`,
    );
    if (_.get(req, "body.request.filters")) {
        req.body.request.filters.compatibilityLevel = {
            "<=": config.get("CONTENT_COMPATIBILITY_LEVEL"),
        };
    }
    return req;
};