import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as _ from "lodash";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
const Hashids = require('hashids/cjs')
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

export class Form {
  @Inject
  private databaseSdk: DatabaseSDK;
  private fileSDK;
  @Inject private standardLog: StandardLogger;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.standardLog = containerAPI.getStandardLoggerInstance();
  }
  public async insert() {

    try {
      const files = await this.fileSDK.readdir(path.join("data", "forms"));
      const formsFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "forms"));
      let formsList = await this.databaseSdk.list("form", { startkey: "_design0" });
      formsList = _.get(formsList, "rows");
      const formsListLength = formsList ? formsList.length : 0;
      const formDocs = [];
      for (const file of files) {
        const form = await this.fileSDK.readJSON(path.join(formsFilesBasePath, file));
        const doc = _.get(form, "result.form");
        doc.rootOrgId = doc.rootOrgId || "*";
        doc.component = doc.component || "*";
        doc.framework = doc.framework || "*";
        const idText = `${doc.type}_${doc.subtype}_${doc.action}_${doc.rootOrgId}_${doc.framework}_${doc.component}`;
        const hash = new Hashids(idText, 10);
        const id = hash.encode(1).toLowerCase();
        let isInserted: any = false;
        if (formsListLength > 0) {
          isInserted = _.find(formsList, { id });
        }
        if (!isInserted) {
          logger.info(`${id} is not inserted`);
          doc._id = id;
          formDocs.push(doc);
        } else {
          logger.info(`${id} is inserted`);
        }
      }
      if (formDocs.length) {
        await this.databaseSdk.bulk("form", formDocs);
      }
    } catch (error) {
      this.standardLog.error({ id: 'FORM_INSERT_FAILED', message: `While inserting forms`, error });
    }
  }

  public search(req, res) {

    const requestBody = req.body;
    let requestObj = _.get(requestBody, "request");
    requestObj = {
      type: requestObj.type.toLowerCase(),
      subtype: requestObj.subType.toLowerCase(),
      action: requestObj.action.toLowerCase(),    };
    // requestObj.rootOrgId = requestObj.rootOrgId || '*';
    // requestObj.component = requestObj.component || '*';
    // requestObj.framework = requestObj.framework || '*';

    const searchObj = {
      selector: requestObj,
    };
    logger.debug(
      `ReqId = "${req.headers["X-msgid"]}": Finding the data from Form database`,
    );
    this.databaseSdk
      .find("form", searchObj)
      .then((data) => {
        data = _.map(data.docs, (doc) => _.omit(doc, ["_id", "_rev"]));
        if (data.length <= 0) {
          this.standardLog.error({ id: 'FORM_DB_SEARCH_FAILED', message: `Received empty data while searching with ${searchObj} in form database`, mid: req.headers["X-msgid"] });
          res.status(404);
          return res.send(Response.error("api.form.read", 404));
        }
        const resObj = {
          form: data[0],
        };
        logger.info(
          `ReqId = "${req.headers["X-msgid"]}": Received data  from - form database`,
        );
        return res.send(Response.success("api.form.read", resObj, req));
      })
      .catch((err) => {
        this.standardLog.error({ id: 'FORM_DB_SEARCH_FAILED', message: `Received error while searching in form database`, mid: req.headers["X-msgid"], error: err });
        if (err.status === 404) {
          res.status(404);
          return res.send(Response.error("api.form.read", 404));
        } else {
          const status = err.status || 500;
          res.status(status);
          return res.send(Response.error("api.form.read", status));
        }
      });
  }

  upsert(formResp: any) {
    const doc = _.get(formResp, "result.form");
    doc.rootOrgId = doc.rootOrgId || "*";
    doc.component = doc.component || "*";
    doc.framework = doc.framework || "*";
    const idText = `${doc.type}_${doc.subtype}_${doc.action}_${doc.rootOrgId}_${doc.framework}_${doc.component}`;
    const hash = new Hashids(idText, 10);
    const id = hash.encode(1).toLowerCase();
    this.databaseSdk.upsert("form", id, doc);
  }
}
