var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contentDownloadManager_1 = require("./manager/contentDownloadManager");
const typescript_ioc_1 = require("typescript-ioc");
const logger_1 = require("@project-sunbird/logger");
const cheerio = require("cheerio");
const proxy = require("express-http-proxy");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const path = require("path");
const url = require("url");
const uuid = require("uuid");
const inline = require("web-resource-inliner");
const config_1 = require("./config");
const appUpdate_1 = require("./controllers/appUpdate");
const channel_1 = require("./controllers/channel");
const content_1 = require("./controllers/content/content");
const contentDelete_1 = require("./controllers/content/contentDelete");
const contentLocation_1 = require("./controllers/contentLocation");
const faqs_1 = require("./controllers/faqs");
const form_1 = require("./controllers/form");
const framework_1 = require("./controllers/framework");
const location_1 = require("./controllers/location");
const organization_1 = require("./controllers/organization");
const resourceBundle_1 = require("./controllers/resourceBundle");
const telemetry_1 = require("./controllers/telemetry");
const tenant_1 = require("./controllers/tenant");
const user_1 = require("./controllers/user");
const telemetryHelper_1 = require("./helper/telemetryHelper");
const response_1 = require("./utils/response");
let telemetry;
const proxyUrl = process.env.APP_BASE_URL;
class Router {
    init(app, manifest, auth) {
        this.contentDownloadManager.initialize();
        const telemetryInstance = api_1.containerAPI
            .getTelemetrySDKInstance()
            .getInstance();
        const enableProxy = (req) => {
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Checking the proxy`);
            let flag = false;
            if (req.get("referer")) {
                const refererUrl = new url.URL(req.get("referer"));
                const pathName = refererUrl.pathname;
                flag = _.startsWith(pathName, "/browse");
            }
            return flag;
        };
        const updateRequestBody = (req) => {
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Updating request body filters`);
            if (_.get(req, "body.request.filters")) {
                req.body.request.filters.compatibilityLevel = {
                    "<=": config_1.default.get("CONTENT_COMPATIBILITY_LEVEL"),
                };
            }
            return req;
        };
        const constructSearchEdata = (req, proxyData) => {
            const telemetryHelper = new telemetryHelper_1.default();
            const edata = {
                type: "content",
                query: _.get(req, "body.request.query"),
                filters: _.get(req, "body.request.filters"),
                correlationid: _.get(proxyData, "params.msgid"),
                size: _.get(proxyData, "result.count"),
            };
            telemetryHelper.logSearchEvent(edata, "Content");
        };
        const logTelemetryEvent = (req, res, next) => {
            const startHrTime = process.hrtime();
            res.on("finish", () => {
                const elapsedHrTime = process.hrtime(startHrTime);
                const elapsedTime = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6) / 1000;
                if (elapsedTime > 1) {
                    logger_1.logger.warn(`${req.headers["X-msgid"] || ""} path: ${req.path} took ${elapsedTime}s`);
                }
                if (res.statusCode >= 200 && res.statusCode <= 300) {
                    const params = [
                        {
                            duration: parseFloat(elapsedTime.toFixed(3)),
                        },
                        {
                            protocol: _.toUpper(req.protocol),
                        },
                        {
                            method: req.method,
                        },
                        {
                            url: req.originalUrl,
                        },
                        {
                            status: res.statusCode,
                        },
                    ];
                    const rid = _.get(req, "rid");
                    if (rid) {
                        params.push({ rid });
                    }
                    const size = parseInt(res.getHeader("Content-Length"));
                    if (size) {
                        params.push({ size });
                    }
                    const logEvent = {
                        context: {
                            env: "openrap-sunbirded-plugin",
                        },
                        edata: {
                            level: "INFO",
                            type: "api_access",
                            message: `The api is successfully processed with url ${req.originalUrl} and method ${req.method}`,
                            params,
                        },
                    };
                    telemetryInstance.log(logEvent);
                }
            });
            next();
        };
        app.use(logTelemetryEvent);
        const addRequestId = (req, res, next) => {
            req.headers["X-msgid"] = req.get("X-msgid") || uuid.v4();
            next();
        };
        app.use(addRequestId);
        // portal static routes
        app.all([
            "/",
            "/play/*",
            "/import/content",
            "/get",
            "/get/*",
            "/browse",
            "/browse/*",
            "/search/*",
            "/help-center",
            "/help-center/*",
            "/profile",
            "/profile/*",
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const locals = yield this.getLocals(manifest);
            _.forIn(locals, (value, key) => {
                res.locals[key] = value;
            });
            res.render(path.join(__dirname, "..", "..", "public", "portal", "index.ejs"));
        }));
        // api's for portal
        const resourcebundle = new resourceBundle_1.ResourceBundle(manifest);
        app.get("/resourcebundles/v1/read/:id", (req, res) => {
            resourcebundle.get(req, res);
        });
        const organization = new organization_1.Organization(manifest);
        app.post("/api/org/v1/search", (req, res, next) => {
            logger_1.logger.debug(`Received API call to search organisations`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger_1.logger.info(`Proxy is Enabled `);
                next();
            }
            else {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Search organisations`);
                return organization.search(req, res);
            }
        }, proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/org/v1/search`;
            },
        }));
        const form = new form_1.Form(manifest);
        app.post("/api/data/v1/form/read", (req, res, next) => {
            logger_1.logger.debug(`Received API call to read formdata`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger_1.logger.info(`Proxy is Enabled `);
                next();
            }
            else {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Search form data`);
                return form.search(req, res);
            }
        }, proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/data/v1/form/read`;
            },
        }));
        const channel = new channel_1.Channel(manifest);
        app.get("/api/channel/v1/read/:id", (req, res, next) => {
            logger_1.logger.debug(`Received API call to get channel data for channel with Id: ${req.params.id}`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger_1.logger.info(`Proxy is Enabled `);
                next();
            }
            else {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Get channel data for channel with Id:${req.params.id}`);
                return channel.get(req, res);
            }
        }, proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/channel/v1/read/${req.params.id}`;
            },
        }));
        const faqs = new faqs_1.Faqs(manifest);
        app.get("/api/faqs/v1/read/:language", faqs.read.bind(faqs));
        const ticketSDK = api_1.containerAPI.getTicketSdkInstance();
        app.post("/api/help/v1/report/issue", (req, res) => __awaiter(this, void 0, void 0, function* () {
            ticketSDK.createTicket(req.body).then((successRes) => {
                res.send(response_1.default.success("api.report.issue", successRes, req));
            }).catch((errorRes) => {
                res.status(errorRes.status || 500).send(response_1.default.error("api.report.issue", errorRes.status, errorRes.message, errorRes.code));
            });
        }));
        const framework = new framework_1.Framework(manifest);
        app.get("/api/framework/v1/read/:id", (req, res, next) => {
            logger_1.logger.debug(`Received API call to get framework data for framework with Id: ${req.params.id}`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger_1.logger.info(`Proxy is Enabled `);
                next();
            }
            else {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Get Framework data for Framework with Id:${req.params.id}`);
                return framework.get(req, res);
            }
        }, proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/framework/v1/read/${req.params.id}`;
            },
        }));
        const tenant = new tenant_1.default();
        app.get(["/v1/tenant/info/", "/v1/tenant/info/:id"], (req, res, next) => {
            logger_1.logger.debug(`Received API call to get tenant data ${_.upperCase(_.get(req, "params.id"))}`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            if (enableProxy(req)) {
                logger_1.logger.info(`Proxy is Enabled `);
                next();
            }
            else {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Get tenant Info`);
                tenant.get(req, res);
                return;
            }
        }, proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/v1/tenant/info/`;
            },
        }));
        const content = new content_1.default(manifest);
        app.get("/api/content/v1/read/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`Received API call to read Content: ${req.params.id}`);
            const offlineData = yield content.getOfflineContents([req.params.id], req.headers["X-msgid"]).catch(error => {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting data from course read`, error);
            });
            if (enableProxy(req) && offlineData.docs.length <= 0) {
                logger_1.logger.info(`Proxy is Enabled`);
                next();
            }
            else {
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Proxy is disabled`);
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Calling Content get method to get Content: ${req.params.id} `);
                content.get(req, res);
                return;
            }
        }), proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/content/v1/read/${req.params.id}?fields=${req.query.fields}`;
            },
            userResDecorator(proxyRes, proxyResData, req) {
                return new Promise(function (resolve) {
                    logger_1.logger.info(`Proxy is Enabled for Content: ${req.params.id}`);
                    logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Convert buffer data to json`);
                    const proxyData = content.convertBufferToJson(proxyResData, req);
                    const contents = _.get(proxyData, "result.content");
                    if (!_.isEmpty(contents)) {
                        logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Calling decorateContent to decorate a content`);
                        content
                            .decorateContentWithProperty([contents], req.headers["X-msgid"])
                            .then((data) => {
                            logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Resolving Data after decorating content `);
                            proxyData.result.content = data[0];
                            resolve(proxyData);
                        })
                            .catch((err) => {
                            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error err.message`, err);
                            resolve(proxyData);
                        });
                    }
                    else {
                        logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Resolving data if there in no content in request`);
                        resolve(proxyData);
                    }
                });
            },
        }));
        app.get("/api/course/v1/hierarchy/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`Received API call to get Course hierarchy: ${req.params.id}`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
            const isProxyEnabled = _.has(req, "query.online") ? online : enableProxy(req);
            const offlineData = yield content.getOfflineContents([req.params.id], req.headers["X-msgid"]).catch((error) => {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received while getting data from course hierarchy`, error);
            });
            if (isProxyEnabled && offlineData.docs.length <= 0) {
                logger_1.logger.info(`Proxy is Enabled`);
                next();
            }
            else {
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Proxy is disabled`);
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Calling Content get method to get CourseHierarchy: ${req.params.id} `);
                content.get(req, res);
                return;
            }
        }), proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                const queryParams = req.url.split("?")[1];
                return queryParams ? `/api/course/v1/hierarchy/${req.params.id}?${queryParams}` : `/api/course/v1/hierarchy/${req.params.id}`;
            },
            userResDecorator(proxyRes, proxyResData, req) {
                return new Promise(function (resolve) {
                    logger_1.logger.info(`Proxy is Enabled for Content: ${req.params.id}`);
                    logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Convert buffer data to json`);
                    const proxyData = content.convertBufferToJson(proxyResData, req);
                    const contents = _.get(proxyData, "result.content");
                    if (!_.isEmpty(contents)) {
                        logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Calling decorateDialCodeContent to decorate a content`);
                        content
                            .decorateDialCodeContents(contents, req.headers["X-msgid"])
                            .then((data) => {
                            logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Resolving Data after decorating DialCodecontent `);
                            proxyData.result.content = data[0];
                            resolve(proxyData);
                        })
                            .catch((err) => {
                            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error err.message`, err);
                            resolve(proxyData);
                        });
                    }
                    else {
                        logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Resolving data if there in no content in course hierarchy request`);
                        resolve(proxyData);
                    }
                });
            },
        }));
        app.get(`/device/profile/:id`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`Received API call to get device profile`);
            const apiKey = yield api_1.containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
                logger_1.logger.error(`Received error while fetching api key in device profile with error: ${err}`);
            });
            req.headers.Authorization = `Bearer ${apiKey}`;
            next();
        }), proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/v3/device/profile/:id`;
            },
        }));
        app.post(`/api/data/v1/dial/assemble`, (req, res, next) => {
            const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
            if (online) {
                req = updateRequestBody(req);
                next();
            }
            else {
                content.searchDialCode(req, res);
                return;
            }
        }, proxy(proxyUrl, {
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
                    }
                    else {
                        resolve(proxyData);
                    }
                });
            },
        }));
        app.post("/api/content/v1/search", (req, res, next) => {
            logger_1.logger.debug(`Received API call to search content`);
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
            if (online) {
                logger_1.logger.info(`Proxy is Enabled `);
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Update requestbody`);
                req = updateRequestBody(req);
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Request body filters updated successfully`);
                next();
            }
            else {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Calling content search method`);
                content.search(req, res);
                return;
            }
        }, proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                return `/api/content/v1/search`;
            },
            userResDecorator(proxyRes, proxyResData, req) {
                return new Promise(function (resolve) {
                    logger_1.logger.info(`Proxy is Enabled for Content`);
                    logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Convert buffer data to json`);
                    const proxyData = content.convertBufferToJson(proxyResData, req);
                    constructSearchEdata(req, proxyData);
                    const contents = _.get(proxyData, "result.content");
                    if (!_.isEmpty(contents)) {
                        logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Calling decorateContent to decorate contents in contentSearch`);
                        content
                            .decorateContentWithProperty(contents, req.headers["X-msgid"])
                            .then((data) => {
                            logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Resolving Data after decorating contents in contentSearch `);
                            proxyData.result.content = data;
                            resolve(proxyData);
                        })
                            .catch((err) => {
                            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error err.message`, err);
                            resolve(proxyData);
                        });
                    }
                    else {
                        logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Resolving data if there in no content in contentSearch request`);
                        resolve(proxyData);
                    }
                });
            },
        }));
        app.post("/api/content/v1/import", content.import.bind(content));
        app.post("/api/content/v1/import/pause/:importId", content.pauseImport.bind(content));
        app.post("/api/content/v1/import/resume/:importId", content.resumeImport.bind(content));
        app.post("/api/content/v1/import/cancel/:importId", content.cancelImport.bind(content));
        app.post("/api/content/v1/import/retry/:importId", content.retryImport.bind(content));
        app.get("/api/content/v1/export/:id", this.setConnectionTimeout(1200000), content.export.bind(content));
        app.post("/api/content/v1/download/list", (req, res) => {
            content.list(req, res);
        });
        app.post("/api/content/v1/download/:id", this.contentDownloadManager.download.bind(this.contentDownloadManager));
        app.post("/api/content/v1/download/pause/:downloadId", this.contentDownloadManager.pause.bind(this.contentDownloadManager));
        app.post("/api/content/v1/download/resume/:downloadId", this.contentDownloadManager.resume.bind(this.contentDownloadManager));
        app.post("/api/content/v1/download/cancel/:downloadId", this.contentDownloadManager.cancel.bind(this.contentDownloadManager));
        app.post("/api/content/v1/download/retry/:downloadId", this.contentDownloadManager.retry.bind(this.contentDownloadManager));
        app.post("/api/content/v1/update/:id", this.contentDownloadManager.update.bind(this.contentDownloadManager));
        telemetry = new telemetry_1.default(manifest);
        app.post(["/content/data/v1/telemetry", "/action/data/v3/telemetry"], (req, res) => {
            telemetry.addEvents(req, res);
        });
        const desktopAppUpdate = new appUpdate_1.default(manifest);
        app.get("/api/desktop/v1/update", desktopAppUpdate.getDesktopAppUpdate.bind(desktopAppUpdate));
        app.get("/api/app/v1/info", desktopAppUpdate.getAppInfo.bind(desktopAppUpdate));
        app.get("/api/desktop/v1/system-info", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contentLocation = new contentLocation_1.default(manifest.id);
                const contentBasePath = yield contentLocation.get();
                const systemInfo = yield api_1.containerAPI
                    .getSystemSDKInstance(manifest.id)
                    .getDeviceInfo();
                systemInfo.contentBasePath = contentBasePath;
                return res.send(response_1.default.success("api.desktop.system-info", systemInfo, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while processing desktop app systemInfo request where err = ${err}`);
                res.status(500);
                return res.send(response_1.default.error("api.desktop.system-info", 500));
            }
        }));
        app.post("/api/desktop/v1/change-content-location", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contentPath = _.get(req.body, "request.path");
                const contentLocation = new contentLocation_1.default(manifest.id);
                const status = contentLocation.set(path.join(contentPath));
                if (status) {
                    return res.send(response_1.default.success("api.desktop.change-content-location", status, req));
                }
                else {
                    res.status(500);
                    return res.send(response_1.default.error("api.desktop.change-content-location", 500));
                }
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while processing desktop app systemInfo request where err = ${err}`);
                res.status(500);
                return res.send(response_1.default.error("api.desktop.change-content-location", 500));
            }
        }));
        const user = new user_1.default(manifest);
        app.post("/api/desktop/user/v1/create", user.create.bind(user));
        app.get("/api/desktop/user/v1/read", user.read.bind(user));
        app.post("/api/desktop/user/v1/update", user.update.bind(user));
        const location = new location_1.Location(manifest);
        app.post("/api/data/v1/location/search", location.proxyToAPI.bind(location), location.search.bind(location));
        app.post("/api/data/v1/location/save", location.saveLocation.bind(location));
        app.get("/api/data/v1/location/read", location.get.bind(location));
        app.get("/learner/data/v1/system/settings/get/custodianOrgId", (req, res) => {
            const resObj = {
                response: {
                    id: "custodianOrgId",
                    field: "custodianOrgId",
                    value: process.env.CUSTODIAN_ORG,
                },
            };
            return res.send(response_1.default.success("api.system.settings.get.custodianOrgId", resObj, req));
        });
        const contentDelete = new contentDelete_1.default(manifest);
        app.post("/api/content/v1/delete", contentDelete.delete.bind(contentDelete));
        app.get("/api/telemetry/v1/info", (req, res) => {
            if (_.get(req, "query.syncConfig") === "true") {
                telemetry.getTelemetrySyncSetting(req, res);
            }
            else {
                telemetry.getInfo(req, res);
            }
        });
        app.post("/api/telemetry/v1/export", telemetry.export.bind(telemetry));
        app.post("/api/telemetry/v1/import", telemetry.import.bind(telemetry));
        app.post("/api/telemetry/v1/import/retry/:importId", telemetry.retryImport.bind(telemetry));
        app.post("/api/telemetry/v1/list", telemetry.list.bind(telemetry));
        app.post("/api/telemetry/v1/config", telemetry.setTelemetrySyncSetting.bind(telemetry));
        app.post("/api/desktop/v1/sync", telemetry.sync.bind(telemetry));
        app.get("/api/app/v1/terms_of_use", proxy(`${proxyUrl}`, {
            proxyReqPathResolver() {
                return `/term-of-use.html`;
            }, userResDecorator(proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    const proxyData = proxyResData.toString();
                    inline.html({
                        fileContent: proxyData,
                        strict: false,
                        relativeTo: process.env.APP_BASE_URL,
                    }, function (err, result) {
                        const $ = cheerio.load(result);
                        $(`#header`).replaceWith(`<header id="header" style="display:none"></header>`);
                        $(`#footer`).replaceWith(`<footer id="footer" style="display:none"></footer>`);
                        $("#terms-of-use").removeClass("header-gap");
                        resolve($.html());
                    });
                });
            },
        }));
        app.use("/content-plugins/*", proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Parsing content-plugin urls`);
                return require("url").parse(proxyUrl + req.originalUrl).path;
            },
        }));
        app.use("/assets/public/*", proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Parsing assets/public urls`);
                return require("url").parse(proxyUrl + req.originalUrl).path;
            },
        }));
        app.use("/contentPlayer/preview/*", proxy(proxyUrl, {
            proxyReqPathResolver(req) {
                logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Parsing contentPlayer/preview/ urls`);
                return require("url").parse(proxyUrl + req.originalUrl).path;
            },
        }));
    }
    setConnectionTimeout(time) {
        return (req, res, next) => {
            req.connection.setTimeout(time);
            next();
        };
    }
    getLocals(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield api_1.containerAPI
                .getSystemSDKInstance(manifest.id)
                .getDeviceId();
            const locals = {};
            locals.userId = null;
            locals.sessionId = null;
            locals.cdnUrl = "";
            locals.theme = "";
            locals.defaultPortalLanguage = "en";
            locals.instance = process.env.APP_NAME;
            locals.appId = process.env.APP_ID;
            locals.defaultTenant = process.env.CHANNEL || "sunbird";
            locals.exploreButtonVisibility = "true";
            locals.helpLinkVisibility = null;
            locals.defaultTenantIndexStatus = null;
            locals.extContWhitelistedDomains = null;
            locals.buildNumber = process.env.APP_VERSION;
            locals.apiCacheTtl = "5";
            locals.cloudStorageUrls = null;
            locals.userUploadRefLink = null;
            locals.googleCaptchaSiteKey = null;
            locals.videoMaxSize = null;
            locals.reportsLocation = null;
            locals.deviceRegisterApi = "/api/v1/device/registry/";
            locals.playerCdnEnabled = "";
            locals.previewCdnUrl = "";
            locals.cdnWorking = null;
            locals.offlineDesktopAppTenant = "";
            locals.offlineDesktopAppVersion = "";
            locals.offlineDesktopAppReleaseDate = "";
            locals.offlineDesktopAppSupportedLanguage = "";
            locals.offlineDesktopAppDownloadUrl = "";
            locals.logFingerprintDetails = "";
            locals.deviceId = deviceId;
            locals.deviceProfileApi = "/api/v3/device/profile";
            locals.deviceApi = `${process.env.APP_BASE_URL}/api/`;
            locals.baseUrl = process.env.APP_BASE_URL;
            return locals;
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", contentDownloadManager_1.ContentDownloadManager)
], Router.prototype, "contentDownloadManager", void 0);
exports.Router = Router;
