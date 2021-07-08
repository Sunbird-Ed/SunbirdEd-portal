import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

const FAQS_DB = "faqs";

export class Faqs {

  @Inject private databaseSdk: DatabaseSDK;
  private fileSDK;
  private faqsBasePath;
  @Inject private standardLog: StandardLogger;
  constructor(manifest) {
      this.databaseSdk.initialize(manifest.id);
      this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
      this.faqsBasePath = this.fileSDK.getAbsPath(path.join("data", "faqs"));
      this.standardLog = containerAPI.getStandardLoggerInstance();
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
      this.standardLog.error({ id: 'FAQ_DB_INSERT_FAILED', message: 'faqs:insert caught exception while inserting faqs', error: err });
    }
  }
  public async read(req, res) {
    const language = req.params.language;
    const faqs = await this.fetchOnlineFaqs(language, req) || await this.fetchOfflineFaqs(language, req);
    if (faqs) {
      res.send(Response.success("api.faqs.read", { faqs }, req));
    } else {
      this.standardLog.error({ id: 'FAQ_NOT_FOUND', message: `FAQ not found for language: ${language}`, mid: req.get("x-msgid") });
      res.status(404).send(Response.error("api.faqs.read", 404));
    }
  }
  public async fetchOfflineFaqs(language, req): Promise<IFaqsData | undefined > {
    let faqsData: IFaqsData = await this.databaseSdk.get(FAQS_DB, language).then((doc) => doc.data).catch((err) => {
      this.standardLog.error({ id: 'FAQ_DB_READ_FAILED', message: `Got error while reading Faq from DB for language: ${language}`, mid: req.get("x-msgid"), error: err });
      return undefined;
    });
    if (!faqsData) { // Load from files. Not needed as we have inserted all faqs json on app start.
      logger.info(`Getting faqs from file system for language:`, language, `for ReqId: ${req.get("x-msgid")}`);
      faqsData = await this.fileSDK.readJSON(path.join(this.faqsBasePath, language + ".json")).catch((err) => {
        this.standardLog.error({ id: 'FAQ_FETCH_FAILED', message: `Got error while reading Faq from file for language ${language}`, error: err, mid: req.get("x-msgid") });
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
    return HTTPService.get(`${process.env.FAQ_BLOB_URL}faq-${language}.json`, config).toPromise()
    .then((data: any) => {
      const faqsData = _.get(data, "data");
      if (faqsData) {
        this.addToDb(language, faqsData);
      }
      return faqsData;
    }).catch((err) => {
      const traceId = _.get(err, 'data.params.msgid');
      this.standardLog.error({ id: 'FAQ_NOT_FOUND', message: `Got error while reading Faq from blob for language: ${language}, with trace Id ${traceId}`, mid: req.get("x-msgid"), error: err });
      return undefined;
    });
  }
  private async addToDb(id: string, data: IFaqsData) {
    await this.databaseSdk.upsert(FAQS_DB, id, { data })
    .catch((err) => {
      this.standardLog.error({ id: 'FAQ_DB_INSERT_FAILED', message: `Received error while insert/updating faqs for language: ${id} to faqs database`, error: err });
    });
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
