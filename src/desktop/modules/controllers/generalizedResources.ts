import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as _ from "lodash";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

const GEN_RESOURCE_DB = "generalized_resource_bundle";
export class GeneralizedResources {

  @Inject private databaseSdk: DatabaseSDK;
  private fileSDK;
  private resourceBasePath;
  @Inject private standardLog: StandardLogger;

  constructor(manifest) {
    this.databaseSdk.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.resourceBasePath = this.fileSDK.getAbsPath(path.join("data", "resourceBundles"));
    this.standardLog = containerAPI.getStandardLoggerInstance();
  }

  public async insert() {
    try {
      const files = await this.fileSDK.readdir(path.join("data", "resourceBundles"));
      const dbData = await this.databaseSdk.list(GEN_RESOURCE_DB, { limit: 1 });
      logger.info("--Inserting generalized resources to db--", dbData.total_rows, files.length);
      if (!dbData.total_rows && files.length) {
        const bulkDocs = [];
        for (const file of files) {
          if (file.startsWith('generalized_')) {
            const data = await this.fileSDK.readJSON(path.join(this.resourceBasePath, file));
            bulkDocs.push({
              _id: path.basename(file, path.extname(file)),
              data
            });
          }
        }
        await this.databaseSdk.bulk(GEN_RESOURCE_DB, bulkDocs);
      }
    } catch (err) {
      this.standardLog.error({ id: 'GENERALIZED_RESOURCE_DB_INSERT_FAILED', message: 'generalized_resource_bundle:insert caught exception while inserting generalized labels', error: err });
    }
  }


  public async read(req, res) {
    const language = req.params.lang;
    const generalizedResources = await this.fetchOnline(language, req) || await this.fetchOffline(language, req);
    if (generalizedResources) {
      res.send(Response.success("api.report", { result: generalizedResources }, req));
    } else {
      logger.error(`Generalized Resources not found for language: `, language, `for ReqId: ${req.get("x-msgid")} `);
      res.status(404).send(Response.error("api.report", 404));
    }
  }

  public async fetchOffline(language, req): Promise<any> {
    const docId = `generalized_${language}`;
    let resources: any = await this.databaseSdk.get(GEN_RESOURCE_DB, docId).then((doc) => doc.data).catch((err) => {
      this.standardLog.error({ id: 'GENERALIZED_RESOURCE_DB_READ_FAILED', message: `Error while reading Generalized resources from DB for language: ${language}`, mid: req.get("x-msgid"), error: err });
      return undefined;
    });

    return resources;
  }

  public async fetchOnline(language, req): Promise<any> {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    return await HTTPService.get(`${process.env.APP_BASE_URL}/getGeneralisedResourcesBundles/${language}/all_labels_${language}.json`, config).toPromise()
      .then((data: any) => {
        const resources = _.get(data, "data.result");
        if (resources) {
          this.addToDb(language, resources);
        }
        return resources;
      }).catch((err) => {
        const traceId = _.get(err, 'data.params.msgid');
        logger.error(`Got error while reading generalized resources from blob for language ${language}, for ReqId: ${req.get("x-msgid")}, error message ${err.message}, with trace Id ${traceId}`);
        return undefined;
      });
  }

  private async addToDb(id: string, data: any) {
    id = `generalized_${id}`;
    await this.databaseSdk.upsert(GEN_RESOURCE_DB, id, { data })
      .catch((err) => this.standardLog.error({ id: 'GENERALIZED_RESOURCE_DB_INSERT_FAILED', message: `Received error while insert/updating generalized resources for language: ${id} to generalized resources database`, error: err }));
  }
}
