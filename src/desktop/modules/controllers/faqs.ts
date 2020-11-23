import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
const FAQS_DB = "faqs";
const FAQ_BLOB_URL = `${process.env.FAQ_BLOB_URL}`;

import { ClassLogger } from "@project-sunbird/logger/decorator";

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
export class Faqs {

  @Inject private databaseSdk: DatabaseSDK;
  private fileSDK;
  private faqsBasePath;
  constructor(manifest) {
      this.databaseSdk.initialize(manifest.id);
      this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
      this.faqsBasePath = this.fileSDK.getAbsPath(path.join("data", "faqs"));
  }
  public async insert() {
    try {
      const files = await this.fileSDK.readdir(path.join("data", "faqs"));
      const dbData = await this.databaseSdk.list(FAQS_DB, {limit: 1});
      logger.info("--Inserting faqs to db--", dbData.total_rows, files.length);
      if (!dbData.total_rows && files.length) {
        const bulkDocs = [];
        for (const file of files) {
          const data: IFaqsData = await this.fileSDK.readJSON(path.join(this.faqsBasePath, file));
          bulkDocs.push({
            _id: path.basename(file, path.extname(file)),
            data,
          });
        }
        await this.databaseSdk.bulk(FAQS_DB, bulkDocs);
      }
    } catch (err) {
      logger.error({
        msg: "faqs:insert caught exception while inserting faqs with error",
        errorMessage: err.message,
        error: err,
      });
    }
  }
  public async read(req, res) {
    const language = req.params.language;
    const faqs = await this.fetchOnlineFaqs(language, req) || await this.fetchOfflineFaqs(language, req);
    if (faqs) {
      res.send(Response.success("api.faqs.read", { faqs }, req));
    } else {
      logger.error(`FAQ not found for language: `, language, `for ReqId: ${req.get("x-msgid")} `);
      res.status(404).send(Response.error("api.faqs.read", 404));
    }
  }
  public async fetchOfflineFaqs(language, req): Promise<IFaqsData | undefined > {
    let faqsData: IFaqsData = await this.databaseSdk.get(FAQS_DB, language).then((doc) => doc.data).catch((err) => {
      logger.error(`Got error while reading Faq from DB for language`, language, `for ReqId: ${req.get("x-msgid")}, error message `, err.message);
      return undefined;
    });
    if (!faqsData) { // Load from files. Not needed as we have inserted all faqs json on app start.
      logger.info(`Getting faqs from file system for language:`, language, `for ReqId: ${req.get("x-msgid")}`);
      faqsData = await this.fileSDK.readJSON(path.join(this.faqsBasePath, language + ".json")).catch((err) => {
        logger.error(`Got error while reading Faq from file for language`, language, `for ReqId: ${req.get("x-msgid")}, error message `, err.message);
        return undefined;
      });
    }
    return faqsData;
  }
  public async fetchOnlineFaqs(language, req): Promise<IFaqsData  | undefined > {
    const config = {
      headers: {
          "content-type": "application/json",
      },
    };
    return await HTTPService.get(`${FAQ_BLOB_URL}faq-${language}.json`, config).toPromise()
    .then((data: any) => {
      const faqsData = _.get(data, "data");
      if (faqsData) {
        this.addToDb(language, faqsData);
      }
      return faqsData;
    }).catch((err) => {
      logger.error(`Got error while reading Faq from blob for language`, language, `for ReqId: ${req.get("x-msgid")}, error message `, err.message);
      return undefined;
    });
  }
  private async addToDb(id: string, data: IFaqsData) {
    await this.databaseSdk.upsert(FAQS_DB, id, { data })
    .catch((err) => logger.error(`Received error while insert/updating faqs for language: ${id} to faqs database and err.message: ${err.message}`));
  }
}

export interface IFaqs {
  topic: string;
  description: string;
}
export interface IFaqsData {
  faqs: IFaqs[];
  constants: object;
}
