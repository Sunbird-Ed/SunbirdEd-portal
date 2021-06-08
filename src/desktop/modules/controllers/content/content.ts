import { logger } from "@project-sunbird/logger";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as _ from "lodash";
import TreeModel from "tree-model";
import { Inject } from "typescript-ioc";
import config from "../../config";
import TelemetryHelper from "../../helper/telemetryHelper";
import { ExportContent } from "../../manager/contentExportManager";
import { ContentImportManager } from "../../manager/contentImportManager";
import DatabaseSDK from "../../sdk/database";
import Response from "../../utils/response";
import { containerAPI, ISystemQueueInstance } from "@project-sunbird/OpenRAP/api";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
const sessionStartTime = Date.now();
const ContentSearchUrl = `${process.env.APP_BASE_URL}/api/content/v1/search`;
const DefaultRequestOptions = { headers: { "Content-Type": "application/json" } };

const INTERVAL_TO_CHECKUPDATE = 1

export default class Content {
    private deviceId: string;
    private contentsFilesPath: string = 'content';
    private ecarsFolderPath: string = 'ecars';
    @Inject
    private databaseSdk: DatabaseSDK;

    @Inject private telemetryHelper: TelemetryHelper;

    @Inject
    private contentImportManager: ContentImportManager;
    private systemQueue: ISystemQueueInstance;

    private fileSDK;
    @Inject private standardLog: StandardLogger;

    constructor(private manifest) {
        this.contentImportManager.initialize();
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
        this.systemQueue = containerAPI.getSystemQueueInstance(manifest.id);
        this.standardLog = containerAPI.getStandardLoggerInstance();
        this.getDeviceId();
    }

    async searchInDB(filters, reqId, sort?) {
        let modifiedFilters: Object = _.mapValues(filters, (v, k) => {
            if (k !== 'query') return ({ '$in': v })
        });
        delete modifiedFilters['query'];
        this.standardLog.info({ id: 'CONTENT_FILTER_QUERY_REMOVED', message: "Deleted 'query' in modifiedFilters", mid: reqId });
        if (_.get(filters, 'query')) {
            modifiedFilters['name'] = {
                "$regex": new RegExp(_.get(filters, 'query'), 'i')
            }
        }
        modifiedFilters['visibility'] = "Default";
        modifiedFilters['$or'] = [
            {"desktopAppMetadata.isAvailable": { $exists: false}},
            {"desktopAppMetadata.isAvailable": { $eq: true}}
          ]
        let dbFilters = {
            selector: modifiedFilters,
            limit: parseInt(config.get('CONTENT_SEARCH_LIMIT'), 10)
        }
        if (sort) {
            logger.info(`ReqId = "${reqId}": Sort is present. Sorting the contents based on given sort properties`)
            for (let sortFields of Object.keys(sort)) {
                dbFilters.selector[sortFields] = {
                    "$gt": null
                }
            }
            dbFilters['sort'] = [sort];
        }
        logger.debug(`ReqId = "${reqId}": Find the contents in ContentDb with the given filters`)
        const dbResult = await this.databaseSdk.find('content', dbFilters);
        let QRresult = [];
        if (_.get(filters, 'query')) {
            QRresult  = await this.searchForDialCodeContent(_.get(filters, 'query'));
        } 
        if(QRresult.length > 0) {
            _.forEach(QRresult, (obj, index) => {
                dbResult.docs.push(obj);
            });
            dbResult.docs = _.uniqBy(dbResult.docs,'identifier');
        } 
        return dbResult;
    }

    get(req: any, res: any): any {
        (async () => {
            try {
                logger.debug(`ReqId = "${req.headers['X-msgid']}": Called Content get method to get Content: ${req.params.id} `);
                let id = req.params.id;
                logger.debug(`ReqId = "${req.headers['X-msgid']}": Get Content: ${id} from ContentDB`);
                let content = await this.databaseSdk.get('content', id);
                content = _.omit(content, ['_id', '_rev']);
                const downloadedContents = await this.changeContentStatus([content], req.headers['X-msgid']);
                if (downloadedContents.length > 0) {
                    content = downloadedContents[0];
                }
                if (this.isAvailableOffline(content)) {
                let resObj = {};
                logger.debug(`ReqId = "${req.headers['X-msgid']}": Call isUpdateRequired()`)
                if (this.isUpdateRequired(content, req)) {
                    logger.debug(`ReqId = "${req.headers['X-msgid']}": Call checkForUpdate() to check whether update is required for content: `, _.get(content, 'identifier'));
                    content = await this.checkForUpdates(content, req)
                    resObj['content'] = content;
                    return res.send(Response.success('api.content.read', resObj, req));
                } else {
                    resObj['content'] = content;
                    return res.send(Response.success('api.content.read', resObj, req));
                }
            } else {
                res.status(404);
                return res.send(Response.error('api.content.read', 404));
            }
            } catch (error) {
                this.standardLog.error({ id: 'CONTENT_DB_READ_FAILED', message: 'Received error while getting the data from content database', error, mid: req.headers['X-msgid'] });
                if (error.status === 404) {
                    res.status(404);
                    return res.send(Response.error('api.content.read', 404));
                } else {
                    let status = error.status || 500;
                    res.status(status);
                    return res.send(Response.error('api.content.read', status));
                }
            }
        })()

    }
    public async list(req: any, res: any) {
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
            const activeDbData = await this.systemQueue.query(activeSelector);
            const inActiveDbData = await this.systemQueue.query(inActiveSelector);
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
                    contentType: _.get(data, 'metaData.contentType'),
                    trackable: _.get(data, 'metaData.trackable'),
                    contentDownloadList: _.map(_.get(data, 'metaData.contentDownloadList'),
                    (doc) => _.omit(doc, ["url"])),


                };
                listData.push(listObj);
            });
            return res.send(Response.success("api.content.list", {
                response: {
                    contents: _.uniqBy(_.orderBy(listData, ["createdOn"], ["desc"]), "contentId"),
                },
            }, req));
        } catch (error) {
            this.standardLog.error({id: 'CONTENT_PROCESS_FAILED', message: 'Error while processing the content list request', error: error.message, mid: req.headers['X-msgid']});
            res.status(500);
            return res.send(Response.error("api.content.list", 500));
        }
    }
    search(req: any, res: any): any {
        logger.debug(`ReqId = "${req.headers['X-msgid']}": Called content search method`);
        let reqBody = req.body;
        let pageReqFilter = this.getFilters(_.get(reqBody, 'request.filters'));
        let contentSearchFields = config.get('CONTENT_SEARCH_FIELDS').split(',');
        const mode = _.get(reqBody, 'request.mode');
        logger.info(`ReqId = "${req.headers['X-msgid']}": picked filters from the request`);
        let filters = _.pick(pageReqFilter, contentSearchFields);
        filters = _.mapValues(filters, function (v) {
            return _.isString(v) ? [v] : v;
        });
        filters = mode ? _.omit(filters, ['board', 'medium', 'gradeLevel', 'subject']) : filters;
        let query = _.get(reqBody, 'request.query');
        if (!_.isEmpty(query)) {
            filters.query = query;
        }
        logger.info(`ReqId = "${req.headers['X-msgid']}": Got query from the request`);
        logger.debug(`ReqId = "${req.headers['X-msgid']}": Searching Content in Db with given filters`)
        this.searchInDB(filters, req.headers['X-msgid'])
            .then(async data => {
                data = _.map(data.docs, doc => _.omit(doc, ['_id', '_rev']));
                let resObj = {};
                let facets = [];
                if (_.get(reqBody, "request.facets")) {
                    facets = await this.getFacets(_.get(reqBody, "request.facets"), data);
                }
                if (data.length === 0) {
                    logger.info(`ReqId = "${req.headers['X-msgid']}": Contents NOT found in DB`);
                        resObj = {
                            content: [],
                            count: 0,
                            facets,
                        };
                } else {
                    const downloadedContents = await this.changeContentStatus(data, req.headers['X-msgid']);
                    if (downloadedContents.length > 0) {
                        data = downloadedContents;
                    }
                    data = _.isEqual(mode, `soft`) ? await this.getOrderedContents(data,
                        _.omit(pageReqFilter, `contentType`)) : data;

                    data = _.map(data, (content) => {
                        if (this.isAvailableOffline(content)) {
                            return content;
                        }
                    });
                    logger.info(`ReqId = "${req.headers['X-msgid']}": Contents = ${data.length} found in DB`)

                    resObj = {
                        content: data,
                        count: data.length,
                        facets,
                    };
                }

                const responseObj = Response.success('api.content.search', resObj, req);
                this.constructSearchEdata(req, responseObj);
                return res.send(responseObj);
            })
            .catch(err => {
                this.standardLog.error({ id: 'CONTENT_SEARCH_FAILED', mid: req.headers['X-msgid'], message: 'Received error while searching content', error: err.message });
                if (err.status === 404) {
                    res.status(404);
                    return res.send(Response.error('api.content.search', 404));
                } else {
                    let status = err.status || 500;
                    res.status(status);
                    return res.send(Response.error('api.content.search', status));
                }
            });
    }

    public async searchForDialCodeContent(dialCode: string): Promise<any> {
        try {
            logger.debug(
                `searchDialCode is called for ${dialCode}`
            );
            const dialcode = dialCode;
            logger.info(
                `ReqId = "getMimeTypeCollections() is calling with ${dialcode} from searchForDialCodeContent() `
            );
            return await this.getMimeTypeCollections(dialcode);
        } catch (err) {
            this.standardLog.error({ id: 'CONTENT_QRCODE_SEARCH_FAILED', message: 'Received error while searching QR code content from searchForDialCodeContent', error: err.message });
            return [];
        }
    }

    public async searchDialCode(req: any, res: any): Promise<any> {
        try {
            logger.debug(
                `ReqId = "${req.headers['X-msgid']}": searchDialCode is called`
            );
            const filters = _.get(req, `body.request.filters`);
            let contents;
            const dialcode = _.isArray(_.get(filters, "dialcodes")) ? _.get(filters, "dialcodes")[0] : _.get(filters, "dialcodes")
            logger.info(
                `ReqId = "${req.headers['X-msgid']}": getMimeTypeCollections() is calling with ${dialcode} from searchDialCode() `
            );
            contents = await this.getMimeTypeCollections(dialcode);
            logger.info(
                `ReqId = "${req.headers['X-msgid']}": changeContentStatus() is calling with ${contents} from searchDialCode() `
            );
            const downloadedContents = await this.changeContentStatus(contents, req.headers['X-msgid']);
            if (downloadedContents.length > 0) {
                contents = downloadedContents;
            }
            logger.info(
                `ReqId = "${req.headers['X-msgid']}": getOrderedContents() is calling with ${contents} from searchDialCode() `
            );
            contents = await this.getOrderedContents(contents, _.get(req, `body.request.userProfile`));
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
            logger.debug(
                `ReqId = "${req.headers['X-msgid']}": returning the response for searchDialCode`
            );
            return res.send(Response.success(`api.page.assemble`, resObj, req.body.request));
        } catch (err) {
            this.standardLog.error({ id: 'CONTENT_DIALCODE_SEARCH_FAILED', mid: req.headers['X-msgid'], message: 'Received error while searching content', error: err.message });
            if (err.status === 404) {
                res.status(404);
                return res.send(Response.error(`api.page.assemble`, 404));
            } else {
                const status = err.status || 500;
                res.status(status);
                return res.send(Response.error(`api.page.assemble`, status));
            }
        }
    }

    public decorateDialSearchContents(sections, msgId) {
        return new Promise(async (resolve, reject) => {
            logger.debug(
                `ReqId = "${msgId}": decorateDialSearchContents is called with sections and length is ${sections.length}`
            );
            const dialCode = { contents: [], contentIds: [] };
            if (sections.length > 1) {
                logger.info(
                    `ReqId = "${msgId}": sections length is ${sections.length} > 1
                    and calling 
                    getSectionContents() for each section`,
                );
                for (const section of sections) {
                    const data = await this.getSectionContents(section);
                    dialCode.contentIds = _.concat(dialCode.contentIds, data[`contentIds`]);
                    dialCode.contents = _.concat(dialCode.contents, _.get(data, `contents`));
                }
            } else {
                logger.info(
                    `ReqId = "${msgId}": sections length is ${sections.length} <= 1 and calling 
                    getSectionContents()`,
                );
                const data = await this.getSectionContents(sections[0]);
                dialCode.contentIds = _.get(data, `contentIds`);
                dialCode.contents = _.get(data, `contents`);
            }
            logger.info(
                `ReqId = "${msgId}": dialCode.contentIds length is ${dialCode.contentIds.length} `,
            );
            if (dialCode.contentIds.length > 0) {
                dialCode.contentIds = _.uniq(dialCode.contentIds);
                const childContents = await this.getChildDataFromApi(dialCode.contentIds);
                dialCode.contents = _.concat(dialCode.contents, childContents);
            }
            dialCode.contents = _.uniqBy(dialCode.contents, `identifier`);
            logger.info(
                `ReqId = "${msgId}": decorateContentWithProperty() is calling `,
            );
            dialCode.contents =  await this.decorateContentWithProperty(dialCode.contents, msgId);
            sections[0].contents = dialCode.contents;
            resolve(sections);
        });
    }

    private getSectionContents (section) {
    return new Promise(async (resolve, reject) => {
        logger.debug(
            ` getSectionContents() is called `,
        );
        let contents = [];
        let contentIds = [];
        if (_.get(section, `collectionsCount`) > 1) {
            contents = _.get(section, `collections`);
            resolve({contents, contentIds});
        } else {
            _.forEach(_.get(section, `contents`), (content) => {
                logger.info(
                    `content ${content.identifier} type
                    is ${content.contentType} and mimetype is: ${content.mimeType}`,
                );
                if ((_.get(content, `contentType`)).toLowerCase() === `textbook`) {
                    contents.push(content);
                } else if ((_.get(content, `contentType`)).toLowerCase() === `textbookunit`) {
                    contentIds = _.uniq(_.concat(contentIds, _.get(content, `children`)));
                }
            });
            resolve({contents, contentIds});
        }
    });
    }

    private getChildDataFromApi (childNodes) {
        logger.debug(
            `getChildDataFromApi() is called with ${childNodes}`,
        );
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
        logger.debug(
            `getChildDataFromApi() is calling content search API`,
            );
        return HTTPService.post(ContentSearchUrl, requestBody, DefaultRequestOptions).toPromise()
            .then((response) => _.get(response, "data.result.content") || []);
        }

    private getOrderedContents(contents, userFilters) {
        return new Promise(async (resolve, reject) => {
            logger.debug(
                `getOrderedContents() is called`,
                );
            const matchedContents = { all: [], some: [], one: []};
            _.forEach(contents,  (content) => {
                const contentFilters = _.pick(content, [`board`, `medium`, `gradeLevel`, `subject`]);
                let matchCount = 0;
                _.forEach(userFilters,  (value, key) => {
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
                    contents = _.reject(contents, {identifier: content.identifier});
                } else if (matchCount > 1 && matchCount < Object.keys(userFilters).length ) {
                     // if the content matches only some user filters
                    matchedContents.some.push(content);
                    contents = _.reject(contents, {identifier: content.identifier});
                } else if (matchCount === 1) {
                     // if the content matches only one user filters
                    matchedContents.one.push(content);
                    contents = _.reject(contents, {identifier: content.identifier});
                }
            });
            logger.debug(
                `all the matched Contents = ${matchedContents.all.length}, some  matched Contents = ${matchedContents.some.length},
                one matched Contents = ${matchedContents.one.length}`,
                );
            const orderContents: object[] = _.concat(matchedContents.all, matchedContents.some, matchedContents.one);
            // push the unmatched contents at the end of the orderContents
            _.forEach(contents, (content) => {
                orderContents.push(content);
            });

            resolve(orderContents);
        });

    }

    private async getMimeTypeCollections(dialCode: string) {
            logger.debug(
            `getMimeTypeCollections() is called`,
            );
            let childContents = [];
            logger.info(
                `finding data from db`,
                );
            const dbData = await this.databaseSdk.find("content", {
                selector: {
                    mimeType: "application/vnd.ekstep.content-collection",
                },
            });

            if (dbData.docs.length) {
                for (const content of dbData.docs) {
                        const resp = await this.getDialCodeResources(content, dialCode);
                        childContents = _.concat(childContents, resp);
                }
                return childContents;
            }
            return [];
    }

    private async getDialCodeResources(content: {}, dialCode: string) {
        logger.debug(
            `getDialCodeResources() is called with dialcode: ${dialCode} and content: ${content}`,
            );
        const model = new TreeModel();
        let treeModel;
        treeModel = model.parse(content);
        const contentIds: string[] = [];
        treeModel.walk((node) => {
            logger.info(
                `dialcode for content : ${_.get(node.model, `dialcodes`)} and user requested dialcode: ${dialCode}`,
            );
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
                } else if ((node.model.contentType).toLowerCase() === "textbook") {
                    contentIds.push(node.model.identifier);
                }
            }
        });
        logger.info(
            `found dialcode contentIds for content ${content['identifier']} : ${contentIds}`,
        );
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
        logger.info(
            `finding contents for ${contentIds} in DB`,
        );
        const dbData = await this.databaseSdk.find("content", dbFilter);
        return dbData.docs;
    }

    getFacets(facets, contents): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            const facetData = [];
            if (contents.length === 0) {
                _.forEach(facets, (facet) => {
                    facetData.push({name: facet, values: []});
                });
                resolve(facetData);
            } else {
                    const extendedFacets = [...facets, ...["board", "medium", "gradeLevel", "subject"]];
                    _.forEach(extendedFacets, (facet) => {
                        let eachFacetData = _.map(contents, (content) => _.get(content, facet));
                        const arrayData = [];
                        _.forEach(eachFacetData, (data) => {
                            if (_.isArray(data)) {
                              _.map(data, (d) => arrayData.push(d));
                            } else {
                                arrayData.push(data);
                            }
                        });
                        eachFacetData = arrayData;
                        const result = _.values(_.groupBy(eachFacetData)).map((data) => {
                            if (!_.isEmpty(data[0])) {
                                return ({ name: data[0], count: data.length});
                            }
                        });

                        if (facet === 'board' || facet === 'se_boards') {
                            facet = 'se_boards'
                        } else if (facet === 'gradeLevel' || facet === 'se_gradeLevels') {
                            facet = 'se_gradeLevels';
                        } else if (facet === 'medium' || facet === 'se_mediums') {
                            facet = 'se_mediums';
                        } else if (facet === 'subject' || facet === 'se_subjects') {
                            facet = 'se_subjects';
                        }

                        const facetList = facetData.map(item => item.name);
                        if (facetList.length && facetList.includes(facet)) {
                            _.each(facetData, (facetItem) => {
                                if(facetItem.name === facet) {
                                    facetItem.values = _.merge(facetItem.values, _.compact(result));
                                }
                            })
                        } else {
                            facetData.push({ name: facet, values: _.compact(result) || [] });
                        }
                    });
                    resolve(facetData);
                }
        });
    }

    public async import(req: any, res: any) {
        const ecarFilePaths = req.body;
        if (!ecarFilePaths) {
            return res.status(400).send(Response.error(`api.content.import`, 400, "MISSING_ECAR_PATH"));
        }
        this.contentImportManager.add(ecarFilePaths).then((jobIds) => {
            res.send(Response.success("api.content.import", {
                importedJobIds: jobIds,
            }, req));
        }).catch((err) => {
            this.standardLog.error({ id: 'CONTENT_IMPORT_FAILED', message: 'Received error while importing a content', mid: req.headers['X-msgid'], error: err });
            res.status(500);
            res.send(Response.error(`api.content.import`, 400, err.errMessage || err.message, err.code));
        });
    }
    public async pauseImport(req: any, res: any) {
        this.contentImportManager.pauseImport(req.params.importId).then((jobIds) => {
            res.send(Response.success("api.content.import", {
                jobIds,
            }, req));
        }).catch((err) => {
            this.standardLog.error({ id: 'CONTENT_IMPORT_PAUSE_FAILED', message: 'Received error while pausing a content import', mid: req.headers['X-msgid'], error: err });
            res.status(500);
            res.send(Response.error(`api.content.import`, 400, err.message));
        });
    }
    public async resumeImport(req: any, res: any) {
        this.contentImportManager.resumeImport(req.params.importId).then((jobIds) => {
            res.send(Response.success("api.content.import", {
                jobIds,
            }, req));
        }).catch((err) => {
            this.standardLog.error({ id: 'CONTENT_IMPORT_RESUME_FAILED', message: 'Received error while resuming a content import', mid: req.headers['X-msgid'], error: err });
            res.status(500);
            res.send(Response.error(`api.content.import`, 400, err.message));
        });
    }
    public async cancelImport(req: any, res: any) {
        await this.contentImportManager.cancelImport(req.params.importId).then((jobIds) => {
            res.send(Response.success("api.content.import", {
                jobIds,
            }, req));
        }).catch((err) => {
            this.standardLog.error({ id: 'CONTENT_IMPORT_CANCEL_FAILED', message: 'Received error while canceling content import process', mid: req.headers['X-msgid'], error: err });
            res.status(500);
            res.send(Response.error(`api.content.import`, 400, err.message));
        });
    }
    public async retryImport(req: any, res: any) {
        this.contentImportManager.retryImport(req.params.importId).then((jobIds) => {
            res.send(Response.success("api.content.retry", {
                jobIds,
            }, req));
        }).catch((err) => {
            this.standardLog.error({ id: 'CONTENT_IMPORT_RETRY_FAILED', message: 'Received error while retrying content import process', mid: req.headers['X-msgid'], error: err });
            res.status(500);
            res.send(Response.error(`api.content.retry`, 400, err.message));
        });
    }
    public async export(req: any, res: any): Promise<any> {
        const id = req.params.id;
        const destFolder = req.query.destFolder;
        logger.debug(`ReqId = "${req.get("X-msgid")}": Get Content: ${id} from ContentDB`);
        const content = await this.databaseSdk.get("content", id);
        let childNode = [];
        if (content.mimeType === "application/vnd.ekstep.content-collection") {
            const dbChildResponse = await this.databaseSdk.find("content",
                {
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
                },
            );
            childNode = dbChildResponse.docs;
        }
        if (!_.has(content.desktopAppMetadata, "isAvailable") ||
        content.desktopAppMetadata.isAvailable) {
            const contentExport = new ExportContent(destFolder, content, childNode);
            contentExport.export((err, data) => {
                if (err) {
                    res.status(500);
                    return res.send(Response.error("api.content.export", 500));
                }
                // Adding telemetry share event
                const exportedChildContentCount = childNode.length - data.skippedContent.length;
                this.constructShareEvent(content, exportedChildContentCount);
                res.status(200);
                res.send(Response.success(`api.content.export`, {
                        response: {
                            ecarFilePath: data.ecarFilePath,
                        },
                    }, req));
            });
        } else {
            res.status(404);
            return res.send(Response.error("api.content.export", 404));
        }
    }

    public async getDeviceId() {
        this.deviceId = await containerAPI.getSystemSDKInstance(this.manifest.id).getDeviceId();
    }

    private constructSearchEdata(req, res) {
        const edata = {
            type: "content",
            query: _.get(req, "body.request.query"),
            filters: _.get(req, "body.request.filters"),
            correlationid: _.get(res, "params.msgid"),
            size: _.get(res, "result.count"),
        };
        this.telemetryHelper.logSearchEvent(edata, "Content");
    }

    private async constructShareEvent(data, childCount) {
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
    }

    /* This method converts the buffer data to json and if any error will catch and return the buffer data */

    convertBufferToJson(proxyResData, req) {
        let proxyData;
        try {
            proxyData = JSON.parse(proxyResData.toString('utf8'));
        } catch (e) {
            this.standardLog.error({ id: 'CONTENT_JSON_PARSE_ERROR', message: 'Received error while parsing the Buffer data to json', mid: req.headers['X-msgid'], error: e });
            return proxyResData;
        }
        logger.info(`ReqId = "${req.headers['X-msgid']}": Succesfully converted Bufferdata to json`)
        return proxyData;
    }


    /* This method is to check contents are present in DB */

    async decorateContentWithProperty(contents, reqId) {
        try {
            const listOfContentIds = [];
            logger.info(`ReqId = "${reqId}": Pushing all the contentId's to an Array for all the requested Contents`)
            for (const content of contents) {
                listOfContentIds.push(content.identifier);
            }
            logger.debug(`ReqId = "${reqId}": Search downloaded and downloading  contents in DB using content Id's`)
            let offlineContents = await this.getAllOfflineContents(listOfContentIds, reqId);
            contents = await this.changeContentStatus(offlineContents.docs, reqId, contents);
            return contents;
        } catch (err) {
            this.standardLog.error({id: 'CONTENT_DECORATE_FAILED', message: 'Received  error while decorating content', mid: reqId, error: err});
            return contents;
        }
    }

    /* This method is to check dialcode contents present in DB */

    decorateDialCodeContents(content, reqId) {
        return this.decorateContentWithProperty([content], reqId);
    }

    /* This method is to search contents for download status in database  */

    private isUpdateRequired(content, req) {

        if (_.get(content, 'desktopAppMetadata.updateAvailable')) {
            logger.info(`ReqId = "${req.headers['X-msgid']}": updateAvailble for content and Don't call API`);
            return false;
        } else if (_.get(content, 'desktopAppMetadata.lastUpdateCheckedOn')) {
            logger.info(`ReqId = "${req.headers['X-msgid']}": checking when is the last updatechecked on`, _.get(content, 'desktopAppMetadata.lastUpdateCheckedOn'));
            return ((Date.now() - _.get(content, 'desktopAppMetadata.lastUpdateCheckedOn')) / 3600000) > INTERVAL_TO_CHECKUPDATE ? true : false;
        }
        logger.info(`ReqId = "${req.headers['X-msgid']}": update is not available for content and call API`);
        return true;
    }

    private checkForUpdates(offlineContent, req) {
        return new Promise(async (resolve, reject) => {
            try {
                let onlineContent = await HTTPService.get(`${process.env.APP_BASE_URL}/api/content/v1/read/${offlineContent.identifier}?field=pkgVersion`, {}).toPromise();
                if (_.get(offlineContent, 'pkgVersion') < _.get(onlineContent, 'data.result.content.pkgVersion')) {
                    offlineContent.desktopAppMetadata.updateAvailable = true;
                }
                offlineContent.desktopAppMetadata.lastUpdateCheckedOn = Date.now();
                await this.databaseSdk.update('content', offlineContent.identifier, offlineContent);
                resolve(offlineContent);
            } catch (err) {
                this.standardLog.error({ id: 'CONTENT_UPDATE_CHECK_FAILED', mid: req.headers['X-msgid'], message: "Error occurred while checking content update", error: err });
                resolve(offlineContent);
            }
        })
    }

    // tslint:disable-next-line:member-ordering
    public async getOfflineContents(contentsIds: string[], reqId: string) {
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
        return this.databaseSdk.find("content", dbFilter);
    }

    // tslint:disable-next-line:member-ordering
    public async getAllOfflineContents(contentsIds: string[], reqId: string) {
        const dbFilter = {
            selector: {
                        identifier: {
                            $in: contentsIds,
                        }
            },
        };
        return this.databaseSdk.find("content", dbFilter);
    }

    // tslint:disable-next-line:member-ordering
    public isAvailableOffline(content) {
        return  (!_.has(content.desktopAppMetadata, "isAvailable") || content.desktopAppMetadata.isAvailable);
    }

    private async changeContentStatus(offlineContents, reqId, onlineContents?) {
        if (onlineContents) {
            offlineContents = _.map(onlineContents, (content) => {
                const data = _.find(offlineContents, { identifier: content.identifier });
                if (data && this.isAvailableOffline(data)) {
                    return data;
                } else {
                    if (data) {
                        content[`desktopAppMetadata`] = data["desktopAppMetadata"];
                    }
                    return content;
                }
            });
        }
        return offlineContents;
    }

    private getFilters(filters) {
        // Update BMG filter names
        const bmgFilters =  _.intersection(Object.keys(filters), ["se_boards", "se_gradeLevels", "se_mediums", "se_subjects"]);
        let keyMap = new Map([["se_boards", 'board'], ["se_gradeLevels", "gradeLevel"], ["se_mediums", "medium"], ["se_subjects", "subject"]]);
        bmgFilters.forEach(newKey => {
            const oldKey = keyMap.get(newKey);
            delete Object.assign(filters, { [oldKey]: filters[newKey] })[newKey];
        });

        return filters;
    }

}