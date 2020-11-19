import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import * as url from "url";
import config from "./../config";
import { Channel } from "./../controllers/channel";
import Content from "./../controllers/content/content";
import { Faqs } from "./../controllers/faqs";
import { Form } from "./../controllers/form";
import { Framework } from "./../controllers/framework";
import { Location } from "./../controllers/location";
import { Organization } from "./../controllers/organization";
import { ResourceBundle } from "./../controllers/resourceBundle";
import Tenant from "./../controllers/tenant";
import { manifest } from "./../manifest";
const proxy = require('express-http-proxy');
import Response from "./../utils/response";

export default (app, proxyURL) => {
    const content = new Content(manifest);
    const resourcebundle = new ResourceBundle(manifest);
    app.get(["/resourcebundles/v1/read/:id", "/resourcebundles/v1/readLang/:id"], (req, res) => {
        resourcebundle.get(req, res);
    });

    const organization = new Organization(manifest);
    app.post(
        "/api/org/v1/search",
        (req, res, next) => {
            logger.debug(`Received API call to search organisations`);

            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger.info(`Proxy is Enabled `);
                next();
            } else {
                logger.debug(
                    `ReqId = "${req.headers["X-msgid"]}": Search organisations`,
                );
                return organization.search(req, res);
            }
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/org/v1/search`;
            },
        }),
    );

    const form = new Form(manifest);
    app.post(
        "/api/data/v1/form/read",
        (req, res, next) => {
            logger.debug(`Received API call to read formdata`);
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger.info(`Proxy is Enabled `);
                next();
            } else {
                logger.debug(`ReqId = "${req.headers["X-msgid"]}": Search form data`);
                return form.search(req, res);
            }
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/data/v1/form/read`;
            },
        }),
    );

    const channel = new Channel(manifest);
    app.get(
        "/api/channel/v1/read/:id",
        (req, res, next) => {
            logger.debug(
                `Received API call to get channel data for channel with Id: ${req.params.id}`,
            );

            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger.info(`Proxy is Enabled `);
                next();
            } else {
                logger.debug(
                    `ReqId = "${req.headers["X-msgid"]}": Get channel data for channel with Id:${req.params.id}`,
                );
                return channel.get(req, res);
            }
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/channel/v1/read/${req.params.id}`;
            },
        }),
    );

    const faqs = new Faqs(manifest);
    app.get("/api/faqs/v1/read/:language", faqs.read.bind(faqs));
    const framework = new Framework(manifest);
    app.get(
        "/api/framework/v1/read/:id",
        (req, res, next) => {
            logger.debug(
                `Received API call to get framework data for framework with Id: ${req.params.id}`,
            );

            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger.info(`Proxy is Enabled `);
                next();
            } else {
                logger.debug(
                    `ReqId = "${req.headers["X-msgid"]}": Get Framework data for Framework with Id:${req.params.id}`,
                );
                return framework.get(req, res);
            }
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/framework/v1/read/${req.params.id}`;
            },
        }),
    );

    const tenant = new Tenant();
    app.get(
        ["/v1/tenant/info/", "/v1/tenant/info/:id"],
        (req, res, next) => {
            logger.debug(
                `Received API call to get tenant data ${_.upperCase(
                    _.get(req, "params.id"),
                )}`,
            );

            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger.info(`Proxy is Enabled `);
                next();
            } else {
                logger.debug(`ReqId = "${req.headers["X-msgid"]}": Get tenant Info`);
                tenant.get(req, res);
                return;
            }
        },
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/v1/tenant/info/`;
            },
        }),
    );

    const location = new Location(manifest);
    app.post(
        "/api/data/v1/location/search", location.proxyToAPI.bind(location), location.search.bind(location),
    );
    app.post(
        "/api/data/v1/location/save", location.saveLocation.bind(location),
    );
    app.get("/api/data/v1/location/read", location.get.bind(location));

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

    app.post(`/api/data/v1/dial/assemble`,
        (req, res, next) => {
            const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
            if (online) {
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

}

const enableProxy = (req) => {
    logger.debug(`ReqId = "${req.headers["X-msgid"]}": Checking the proxy`);
    let flag = false;
    if (req.get("referer")) {
        const refererUrl = new url.URL(req.get("referer"));
        const pathName = refererUrl.pathname;
        flag = _.startsWith(pathName, "/browse");
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