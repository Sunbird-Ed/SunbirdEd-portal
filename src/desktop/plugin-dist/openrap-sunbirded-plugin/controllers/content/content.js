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
const typescript_ioc_1 = require("typescript-ioc");
const database_1 = require("../../sdk/database");
const _ = require("lodash");
const config_1 = require("../../config");
const response_1 = require("../../utils/response");
const logger_1 = require("@project-sunbird/logger");
const contentImportManager_1 = require("../../manager/contentImportManager");
const api_1 = require("OpenRAP/dist/api");
const TreeModel = require("tree-model");
const services_1 = require("@project-sunbird/ext-framework-server/services");
const contentExportManager_1 = require("../../manager/contentExportManager");
const telemetryHelper_1 = require("../../helper/telemetryHelper");
const sessionStartTime = Date.now();
const ContentSearchUrl = `${process.env.APP_BASE_URL}/api/content/v1/search`;
const DefaultRequestOptions = { headers: { "Content-Type": "application/json" } };
const INTERVAL_TO_CHECKUPDATE = 1;
// @ClassLogger({
//   logLevel: "debug",
//   logTime: true
// })
class Content {
    constructor(manifest) {
        this.manifest = manifest;
        this.contentsFilesPath = 'content';
        this.ecarsFolderPath = 'ecars';
        this.contentImportManager.initialize();
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest.id);
        this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest.id);
        this.getDeviceId();
    }
    searchInDB(filters, reqId, sort) {
        let modifiedFilters = _.mapValues(filters, (v, k) => {
            if (k !== 'query')
                return ({ '$in': v });
        });
        delete modifiedFilters['query'];
        logger_1.logger.info(`ReqId = "${reqId}": Deleted 'query' in modifiedFilters`);
        if (_.get(filters, 'query')) {
            modifiedFilters['name'] = {
                "$regex": new RegExp(_.get(filters, 'query'), 'i')
            };
        }
        modifiedFilters['visibility'] = "Default";
        modifiedFilters['$or'] = [
            { "desktopAppMetadata.isAvailable": { $exists: false } },
            { "desktopAppMetadata.isAvailable": { $eq: true } }
        ];
        let dbFilters = {
            selector: modifiedFilters,
            limit: parseInt(config_1.default.get('CONTENT_SEARCH_LIMIT'), 10)
        };
        if (sort) {
            logger_1.logger.info(`ReqId = "${reqId}": Sort is present. Sorting the contents based on given sort properties`);
            for (let sortFields of Object.keys(sort)) {
                dbFilters.selector[sortFields] = {
                    "$gt": null
                };
            }
            dbFilters['sort'] = [sort];
        }
        logger_1.logger.debug(`ReqId = "${reqId}": Find the contents in ContentDb with the given filters`);
        return this.databaseSdk.find('content', dbFilters);
    }
    get(req, res) {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": Called Content get method to get Content: ${req.params.id} `);
                let id = req.params.id;
                logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": Get Content: ${id} from ContentDB`);
                let content = yield this.databaseSdk.get('content', id);
                content = _.omit(content, ['_id', '_rev']);
                const downloadedContents = yield this.changeContentStatus([content], req.headers['X-msgid']);
                if (downloadedContents.length > 0) {
                    content = downloadedContents[0];
                }
                if (this.isAvailableOffline(content)) {
                    let resObj = {};
                    logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": Call isUpdateRequired()`);
                    if (this.isUpdateRequired(content, req)) {
                        logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": Call checkForUpdate() to check whether update is required for content: `, _.get(content, 'identifier'));
                        content = yield this.checkForUpdates(content, req);
                        resObj['content'] = content;
                        return res.send(response_1.default.success('api.content.read', resObj, req));
                    }
                    else {
                        resObj['content'] = content;
                        return res.send(response_1.default.success('api.content.read', resObj, req));
                    }
                }
                else {
                    res.status(404);
                    return res.send(response_1.default.error('api.content.read', 404));
                }
            }
            catch (error) {
                logger_1.logger.error(`ReqId = "${req.headers['X-msgid']}": Received error while getting the data from content database and err.message: ${error}`);
                if (error.status === 404) {
                    res.status(404);
                    return res.send(response_1.default.error('api.content.read', 404));
                }
                else {
                    let status = error.status || 500;
                    res.status(status);
                    return res.send(response_1.default.error('api.content.read', status));
                }
            }
        }))();
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeSelector = {
                    isActive: true,
                    group: 'CONTENT_MANAGER',
                };
                const inActiveSelector = {
                    isActive: false,
                    group: 'CONTENT_MANAGER',
                    updatedOn: { "$gt": sessionStartTime },
                };
                const activeDbData = yield this.systemQueue.query(activeSelector);
                const inActiveDbData = yield this.systemQueue.query(inActiveSelector);
                const dbData = _.concat(activeDbData.docs, inActiveDbData.docs);
                const listData = [];
                _.forEach(dbData, (data) => {
                    const listObj = {
                        // tslint:disable-next-line: max-line-length
                        contentId: _.get(data, 'metaData.contentId') ? _.get(data, 'metaData.contentId') : _.get(data, '_id'),
                        identifier: _.get(data, 'metaData.contentId'),
                        id: _.get(data, '_id'),
                        resourceId: _.get(data, 'metaData.contentId'),
                        name: _.get(data, 'name'),
                        totalSize: _.get(data, 'metaData.contentSize'),
                        downloadedSize: _.get(data, 'progress'),
                        status: _.get(data, 'status'),
                        createdOn: _.get(data, 'createdOn'),
                        pkgVersion: _.get(data, 'metaData.pkgVersion'),
                        mimeType: _.get(data, 'metaData.mimeType'),
                        failedCode: _.get(data, 'failedCode'),
                        failedReason: _.get(data, 'failedReason'),
                        addedUsing: _.toLower(_.get(data, 'type')),
                        contentDownloadList: _.map(_.get(data, 'metaData.contentDownloadList'), (doc) => _.omit(doc, ["url"])),
                    };
                    listData.push(listObj);
                });
                return res.send(response_1.default.success("api.content.list", {
                    response: {
                        contents: _.uniqBy(_.orderBy(listData, ["createdOn"], ["desc"]), "contentId"),
                    },
                }, req));
            }
            catch (error) {
                logger_1.logger.error(`ReqId = "${req.headers['X-msgid']}": Error while processing the content list request and err.message: ${error.message}`);
                res.status(500);
                return res.send(response_1.default.error("api.content.list", 500));
            }
        });
    }
    search(req, res) {
        logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": Called content search method`);
        let reqBody = req.body;
        let pageReqFilter = _.get(reqBody, 'request.filters');
        let contentSearchFields = config_1.default.get('CONTENT_SEARCH_FIELDS').split(',');
        const mode = _.get(reqBody, 'request.mode');
        logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": picked filters from the request`);
        let filters = _.pick(pageReqFilter, contentSearchFields);
        filters = _.mapValues(filters, function (v) {
            return _.isString(v) ? [v] : v;
        });
        filters = mode ? _.omit(filters, ['board', 'medium', 'gradeLevel', 'subject']) : filters;
        let query = _.get(reqBody, 'request.query');
        if (!_.isEmpty(query)) {
            filters.query = query;
        }
        logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": Got query from the request`);
        logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": Searching Content in Db with given filters`);
        this.searchInDB(filters, req.headers['X-msgid'])
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            data = _.map(data.docs, doc => _.omit(doc, ['_id', '_rev']));
            let resObj = {};
            let facets = [];
            if (_.get(reqBody, "request.facets")) {
                facets = yield this.getFacets(_.get(reqBody, "request.facets"), data);
            }
            if (data.length === 0) {
                logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": Contents NOT found in DB`);
                resObj = {
                    content: [],
                    count: 0,
                    facets,
                };
            }
            else {
                const downloadedContents = yield this.changeContentStatus(data, req.headers['X-msgid']);
                if (downloadedContents.length > 0) {
                    data = downloadedContents;
                }
                data = _.isEqual(mode, `soft`) ? yield this.getOrderedContents(data, _.omit(pageReqFilter, `contentType`)) : data;
                data = _.map(data, (content) => {
                    if (this.isAvailableOffline(content)) {
                        return content;
                    }
                });
                logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": Contents = ${data.length} found in DB`);
                resObj = {
                    content: data,
                    count: data.length,
                    facets,
                };
            }
            const responseObj = response_1.default.success('api.content.search', resObj, req);
            this.constructSearchEdata(req, responseObj);
            return res.send(responseObj);
        }))
            .catch(err => {
            console.log(err);
            logger_1.logger.error(`ReqId = "${req.headers['X-msgid']}":  Received error while searching content - err.message: ${err.message} ${err}`);
            if (err.status === 404) {
                res.status(404);
                return res.send(response_1.default.error('api.content.search', 404));
            }
            else {
                let status = err.status || 500;
                res.status(status);
                return res.send(response_1.default.error('api.content.search', status));
            }
        });
    }
    searchDialCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": searchDialCode is called`);
                const filters = _.get(req, `body.request.filters`);
                let contents;
                const dialcode = _.isArray(_.get(filters, "dialcodes")) ? _.get(filters, "dialcodes")[0] : _.get(filters, "dialcodes");
                logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": getMimeTypeCollections() is calling with ${dialcode} from searchDialCode() `);
                contents = yield this.getMimeTypeCollections(dialcode);
                logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": changeContentStatus() is calling with ${contents} from searchDialCode() `);
                const downloadedContents = yield this.changeContentStatus(contents, req.headers['X-msgid']);
                if (downloadedContents.length > 0) {
                    contents = downloadedContents;
                }
                logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": getOrderedContents() is calling with ${contents} from searchDialCode() `);
                contents = yield this.getOrderedContents(contents, _.get(req, `body.request.userProfile`));
                contents = _.map(contents, (content) => _.omit(content, ['_id', '_rev']));
                contents = _.map(contents, (content) => {
                    if (this.isAvailableOffline(content)) {
                        return content;
                    }
                });
                const resObj = {
                    response: {
                        ignoredSections: [],
                        name: "DIAL Code Consumption",
                        id: "0126541330541690882",
                        sections: [
                            {
                                display: "{\"name\":{\"en\":\"Linked Content\"}}",
                                alt: null,
                                description: null,
                                index: 1,
                                sectionDataType: "content",
                                facets: [],
                                imgUrl: null,
                                name: "Linked Content",
                                id: "0126541330342952961",
                                dynamicFilters: null,
                                dataSource: null,
                                apiId: "api.content.search",
                                group: 1,
                                searchQuery: JSON.stringify(req.body),
                                contents: _.compact(contents),
                            },
                        ],
                    },
                };
                logger_1.logger.debug(`ReqId = "${req.headers['X-msgid']}": returning the response for searchDialCode`);
                return res.send(response_1.default.success(`api.page.assemble`, resObj, req.body.request));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers['X-msgid']}":  Received error while searching content - err.message: ${err.message} ${err}`);
                if (err.status === 404) {
                    res.status(404);
                    return res.send(response_1.default.error(`api.page.assemble`, 404));
                }
                else {
                    const status = err.status || 500;
                    res.status(status);
                    return res.send(response_1.default.error(`api.page.assemble`, status));
                }
            }
        });
    }
    decorateDialSearchContents(sections, msgId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`ReqId = "${msgId}": decorateDialSearchContents is called with sections and length is ${sections.length}`);
            const dialCode = { contents: [], contentIds: [] };
            if (sections.length > 1) {
                logger_1.logger.info(`ReqId = "${msgId}": sections length is ${sections.length} > 1
                    and calling 
                    getSectionContents() for each section`);
                for (const section of sections) {
                    const data = yield this.getSectionContents(section);
                    dialCode.contentIds = _.concat(dialCode.contentIds, data[`contentIds`]);
                    dialCode.contents = _.concat(dialCode.contents, _.get(data, `contents`));
                }
            }
            else {
                logger_1.logger.info(`ReqId = "${msgId}": sections length is ${sections.length} <= 1 and calling 
                    getSectionContents()`);
                const data = yield this.getSectionContents(sections[0]);
                dialCode.contentIds = _.get(data, `contentIds`);
                dialCode.contents = _.get(data, `contents`);
            }
            logger_1.logger.info(`ReqId = "${msgId}": dialCode.contentIds length is ${dialCode.contentIds.length} `);
            if (dialCode.contentIds.length > 0) {
                dialCode.contentIds = _.uniq(dialCode.contentIds);
                const childContents = yield this.getChildDataFromApi(dialCode.contentIds);
                dialCode.contents = _.concat(dialCode.contents, childContents);
            }
            dialCode.contents = _.uniqBy(dialCode.contents, `identifier`);
            logger_1.logger.info(`ReqId = "${msgId}": decorateContentWithProperty() is calling `);
            dialCode.contents = yield this.decorateContentWithProperty(dialCode.contents, msgId);
            sections[0].contents = dialCode.contents;
            resolve(sections);
        }));
    }
    getSectionContents(section) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(` getSectionContents() is called `);
            let contents = [];
            let contentIds = [];
            if (_.get(section, `collectionsCount`) > 1) {
                contents = _.get(section, `collections`);
                resolve({ contents, contentIds });
            }
            else {
                _.forEach(_.get(section, `contents`), (content) => {
                    logger_1.logger.info(`content ${content.identifier} type
                    is ${content.contentType} and mimetype is: ${content.mimeType}`);
                    if ((_.get(content, `contentType`)).toLowerCase() === `textbook`) {
                        contents.push(content);
                    }
                    else if ((_.get(content, `contentType`)).toLowerCase() === `textbookunit`) {
                        contentIds = _.uniq(_.concat(contentIds, _.get(content, `children`)));
                    }
                });
                resolve({ contents, contentIds });
            }
        }));
    }
    getChildDataFromApi(childNodes) {
        logger_1.logger.debug(`getChildDataFromApi() is called with ${childNodes}`);
        if (!childNodes || !childNodes.length) {
            return Promise.resolve([]);
        }
        const requestBody = {
            request: {
                filters: {
                    identifier: childNodes,
                    mimeType: { "!=": "application/vnd.ekstep.content-collection" },
                },
                limit: childNodes.length,
            },
        };
        logger_1.logger.debug(`getChildDataFromApi() is calling content search API`);
        return services_1.HTTPService.post(ContentSearchUrl, requestBody, DefaultRequestOptions).toPromise()
            .then((response) => _.get(response, "data.result.content") || []);
    }
    getOrderedContents(contents, userFilters) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`getOrderedContents() is called`);
            const matchedContents = { all: [], some: [], one: [] };
            _.forEach(contents, (content) => {
                const contentFilters = _.pick(content, [`board`, `medium`, `gradeLevel`, `subject`]);
                let matchCount = 0;
                _.forEach(userFilters, (value, key) => {
                    // check if content matches with the user filters
                    const matched = _.isArray(contentFilters[key]) ? !_.isEmpty(_.intersection(value, content[key]))
                        : _.includes(value, _.get(content, key));
                    // increase the matchCount if content matches with userFilters
                    matched ? matchCount++ : ``;
                });
                // orderContents based on userFilters match count
                if (matchCount === Object.keys(userFilters).length) {
                    // if the content matches all user filters
                    matchedContents.all.push(content);
                    // delete the matched content from contents array
                    contents = _.reject(contents, { identifier: content.identifier });
                }
                else if (matchCount > 1 && matchCount < Object.keys(userFilters).length) {
                    // if the content matches only some user filters
                    matchedContents.some.push(content);
                    contents = _.reject(contents, { identifier: content.identifier });
                }
                else if (matchCount === 1) {
                    // if the content matches only one user filters
                    matchedContents.one.push(content);
                    contents = _.reject(contents, { identifier: content.identifier });
                }
            });
            logger_1.logger.debug(`all the matched Contents = ${matchedContents.all.length}, some  matched Contents = ${matchedContents.some.length},
                one matched Contents = ${matchedContents.one.length}`);
            const orderContents = _.concat(matchedContents.all, matchedContents.some, matchedContents.one);
            // push the unmatched contents at the end of the orderContents
            _.forEach(contents, (content) => {
                orderContents.push(content);
            });
            resolve(orderContents);
        }));
    }
    getMimeTypeCollections(dialCode) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`getMimeTypeCollections() is called`);
            let childContents = [];
            logger_1.logger.info(`finding data from db`);
            const dbData = yield this.databaseSdk.find("content", {
                selector: {
                    mimeType: "application/vnd.ekstep.content-collection",
                },
            });
            if (dbData.docs.length) {
                for (const content of dbData.docs) {
                    const resp = yield this.getDialCodeResources(content, dialCode);
                    childContents = _.concat(childContents, resp);
                }
                return childContents;
            }
            return [];
        });
    }
    getDialCodeResources(content, dialCode) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`getDialCodeResources() is called with dialcode: ${dialCode} and content: ${content}`);
            const model = new TreeModel();
            let treeModel;
            treeModel = model.parse(content);
            const contentIds = [];
            treeModel.walk((node) => {
                logger_1.logger.info(`dialcode for content : ${_.get(node.model, `dialcodes`)} and user requested dialcode: ${dialCode}`);
                if (node.model.dialcodes &&
                    (_.includes(node.model.dialcodes, (dialCode).toUpperCase()) ||
                        _.includes(node.model.dialcodes, (dialCode).toLowerCase()))) {
                    if ((node.model.contentType).toLowerCase() === "textbookunit" &&
                        node.model.mimeType === "application/vnd.ekstep.content-collection") {
                        node.all((childNode) => {
                            if (childNode.model.mimeType !== "application/vnd.ekstep.content-collection") {
                                contentIds.push(childNode.model.identifier);
                            }
                        });
                    }
                    else if ((node.model.contentType).toLowerCase() === "textbook") {
                        contentIds.push(node.model.identifier);
                    }
                }
            });
            logger_1.logger.info(`found dialcode contentIds for content ${content['identifier']} : ${contentIds}`);
            if (_.isEmpty(contentIds)) {
                return [];
            }
            const dbFilter = {
                selector: {
                    _id: {
                        $in: contentIds,
                    },
                },
            };
            logger_1.logger.info(`finding contents for ${contentIds} in DB`);
            const dbData = yield this.databaseSdk.find("content", dbFilter);
            return dbData.docs;
        });
    }
    getFacets(facets, contents) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const facetData = [];
            if (contents.length === 0) {
                _.forEach(facets, (facet) => {
                    facetData.push({ name: facet, values: [] });
                });
                resolve(facetData);
            }
            else {
                _.forEach(facets, (facet) => {
                    let eachFacetData = _.map(contents, (content) => _.get(content, facet));
                    const arrayData = [];
                    _.forEach(eachFacetData, (data) => {
                        if (_.isArray(data)) {
                            _.map(data, (d) => arrayData.push(d));
                        }
                        else {
                            arrayData.push(data);
                        }
                    });
                    eachFacetData = arrayData;
                    const result = _.values(_.groupBy(eachFacetData)).map((data) => {
                        if (!_.isEmpty(data[0])) {
                            return ({ name: data[0], count: data.length });
                        }
                    });
                    facetData.push({ name: facet, values: _.compact(result) || [] });
                });
                resolve(facetData);
            }
        }));
    }
    import(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ecarFilePaths = req.body;
            if (!ecarFilePaths) {
                return res.status(400).send(response_1.default.error(`api.content.import`, 400, "MISSING_ECAR_PATH"));
            }
            this.contentImportManager.add(ecarFilePaths).then((jobIds) => {
                res.send(response_1.default.success("api.content.import", {
                    importedJobIds: jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.content.import`, 400, err.errMessage || err.message, err.code));
            });
        });
    }
    pauseImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contentImportManager.pauseImport(req.params.importId).then((jobIds) => {
                res.send(response_1.default.success("api.content.import", {
                    jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.content.import`, 400, err.message));
            });
        });
    }
    resumeImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contentImportManager.resumeImport(req.params.importId).then((jobIds) => {
                res.send(response_1.default.success("api.content.import", {
                    jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.content.import`, 400, err.message));
            });
        });
    }
    cancelImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.contentImportManager.cancelImport(req.params.importId).then((jobIds) => {
                res.send(response_1.default.success("api.content.import", {
                    jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.content.import`, 400, err.message));
            });
        });
    }
    retryImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contentImportManager.retryImport(req.params.importId).then((jobIds) => {
                res.send(response_1.default.success("api.content.retry", {
                    jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.content.retry`, 400, err.message));
            });
        });
    }
    export(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const destFolder = req.query.destFolder;
            logger_1.logger.debug(`ReqId = "${req.get("X-msgid")}": Get Content: ${id} from ContentDB`);
            const content = yield this.databaseSdk.get("content", id);
            let childNode = [];
            if (content.mimeType === "application/vnd.ekstep.content-collection") {
                const dbChildResponse = yield this.databaseSdk.find("content", {
                    selector: {
                        $and: [
                            {
                                _id: {
                                    $in: content.childNodes,
                                },
                            },
                            {
                                mimeType: {
                                    $nin: ["application/vnd.ekstep.content-collection"]
                                },
                            },
                        ],
                    },
                });
                childNode = dbChildResponse.docs;
            }
            if (!_.has(content.desktopAppMetadata, "isAvailable") ||
                content.desktopAppMetadata.isAvailable) {
                const contentExport = new contentExportManager_1.ExportContent(destFolder, content, childNode);
                contentExport.export((err, data) => {
                    if (err) {
                        res.status(500);
                        return res.send(response_1.default.error("api.content.export", 500));
                    }
                    // Adding telemetry share event
                    const exportedChildContentCount = childNode.length - data.skippedContent.length;
                    this.constructShareEvent(content, exportedChildContentCount);
                    res.status(200);
                    res.send(response_1.default.success(`api.content.export`, {
                        response: {
                            ecarFilePath: data.ecarFilePath,
                        },
                    }, req));
                });
            }
            else {
                res.status(404);
                return res.send(response_1.default.error("api.content.export", 404));
            }
        });
    }
    getDeviceId() {
        return __awaiter(this, void 0, void 0, function* () {
            this.deviceId = yield api_1.containerAPI.getSystemSDKInstance(this.manifest.id).getDeviceId();
        });
    }
    constructSearchEdata(req, res) {
        const edata = {
            type: "content",
            query: _.get(req, "body.request.query"),
            filters: _.get(req, "body.request.filters"),
            correlationid: _.get(res, "params.msgid"),
            size: _.get(res, "result.count"),
        };
        this.telemetryHelper.logSearchEvent(edata, "Content");
    }
    constructShareEvent(data, childCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfers = 1 + childCount;
            const telemetryShareItems = [{
                    id: _.get(data, "contentId"),
                    type: _.get(data, "contentType"),
                    ver: _.toString(_.get(data, "pkgVersion")),
                    params: [
                        { transfers: _.toString(transfers) },
                        { size: _.toString(_.get(data, "size")) },
                    ],
                    origin: {
                        id: this.deviceId,
                        type: "Device",
                    },
                }];
            this.telemetryHelper.logShareEvent(telemetryShareItems, "Out", "Content");
        });
    }
    /* This method converts the buffer data to json and if any error will catch and return the buffer data */
    convertBufferToJson(proxyResData, req) {
        let proxyData;
        try {
            proxyData = JSON.parse(proxyResData.toString('utf8'));
        }
        catch (e) {
            console.log(e);
            logger_1.logger.error(`ReqId = "${req.headers['X-msgid']}": Received error while parsing the Bufferdata to json: ${e}`);
            return proxyResData;
        }
        logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": Succesfully converted Bufferdata to json`);
        return proxyData;
    }
    /* This method is to check contents are present in DB */
    decorateContentWithProperty(contents, reqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listOfContentIds = [];
                logger_1.logger.info(`ReqId = "${reqId}": Pushing all the contentId's to an Array for all the requested Contents`);
                for (const content of contents) {
                    listOfContentIds.push(content.identifier);
                }
                logger_1.logger.debug(`ReqId = "${reqId}": Search downloaded and downloading  contents in DB using content Id's`);
                let offlineContents = yield this.getAllOfflineContents(listOfContentIds, reqId);
                contents = yield this.changeContentStatus(offlineContents.docs, reqId, contents);
                return contents;
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${reqId}": Received  error err.message: ${err.message} ${err}`);
                return contents;
            }
        });
    }
    /* This method is to check dialcode contents present in DB */
    decorateDialCodeContents(content, reqId) {
        return this.decorateContentWithProperty([content], reqId);
    }
    /* This method is to search contents for download status in database  */
    isUpdateRequired(content, req) {
        if (_.get(content, 'desktopAppMetadata.updateAvailable')) {
            logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": updateAvailble for content and Don't call API`);
            return false;
        }
        else if (_.get(content, 'desktopAppMetadata.lastUpdateCheckedOn')) {
            logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": checking when is the last updatechecked on`, _.get(content, 'desktopAppMetadata.lastUpdateCheckedOn'));
            return ((Date.now() - _.get(content, 'desktopAppMetadata.lastUpdateCheckedOn')) / 3600000) > INTERVAL_TO_CHECKUPDATE ? true : false;
        }
        logger_1.logger.info(`ReqId = "${req.headers['X-msgid']}": update is not available for content and call API`);
        return true;
    }
    checkForUpdates(offlineContent, req) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let onlineContent = yield services_1.HTTPService.get(`${process.env.APP_BASE_URL}/api/content/v1/read/${offlineContent.identifier}?field=pkgVersion`, {}).toPromise();
                if (_.get(offlineContent, 'pkgVersion') < _.get(onlineContent, 'data.result.content.pkgVersion')) {
                    offlineContent.desktopAppMetadata.updateAvailable = true;
                }
                offlineContent.desktopAppMetadata.lastUpdateCheckedOn = Date.now();
                yield this.databaseSdk.update('content', offlineContent.identifier, offlineContent);
                resolve(offlineContent);
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers['X-msgid']}": Error occured while checking content update : ${err}`);
                resolve(offlineContent);
            }
        }));
    }
    // tslint:disable-next-line:member-ordering
    getOfflineContents(contentsIds, reqId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbFilter = {
                selector: {
                    identifier: {
                        $in: contentsIds,
                    },
                    $or: [
                        { "desktopAppMetadata.isAvailable": { $exists: false } },
                        { "desktopAppMetadata.isAvailable": { $eq: true } }
                    ]
                },
            };
            return yield this.databaseSdk.find("content", dbFilter);
        });
    }
    // tslint:disable-next-line:member-ordering
    getAllOfflineContents(contentsIds, reqId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbFilter = {
                selector: {
                    identifier: {
                        $in: contentsIds,
                    }
                },
            };
            return yield this.databaseSdk.find("content", dbFilter);
        });
    }
    // tslint:disable-next-line:member-ordering
    isAvailableOffline(content) {
        return (!_.has(content.desktopAppMetadata, "isAvailable") || content.desktopAppMetadata.isAvailable);
    }
    changeContentStatus(offlineContents, reqId, onlineContents) {
        return __awaiter(this, void 0, void 0, function* () {
            if (onlineContents) {
                offlineContents = _.map(onlineContents, (content) => {
                    const data = _.find(offlineContents, { identifier: content.identifier });
                    if (data && this.isAvailableOffline(data)) {
                        return data;
                    }
                    else {
                        if (data) {
                            content[`desktopAppMetadata`] = data["desktopAppMetadata"];
                        }
                        return content;
                    }
                });
                return offlineContents;
            }
            return offlineContents;
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], Content.prototype, "databaseSdk", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryHelper_1.default)
], Content.prototype, "telemetryHelper", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", contentImportManager_1.ContentImportManager)
], Content.prototype, "contentImportManager", void 0);
exports.default = Content;
