import * as fs from "fs";
import * as  _ from "lodash";
import { Inject, Singleton } from "typescript-ioc";
import * as path from "path";
import { handelError, IContentImportData, ImportSteps } from "./IContentImport";
import DatabaseSDK from "../../sdk/database";
import { logger } from "@project-sunbird/logger";
import { containerAPI, ISystemQueueInstance, ISystemQueue, SystemQueueReq, SystemQueueStatus } from "@project-sunbird/OpenRAP/api";
import { manifest } from "../../manifest";
import TelemetryHelper from "../../helper/telemetryHelper";
import { ImportContent } from "./contentImport";
@Singleton
export class ContentImportManager {
  @Inject private dbSDK: DatabaseSDK;
  @Inject private telemetryHelper: TelemetryHelper;
  private systemQueue: ISystemQueueInstance;
  public async initialize() {
    this.systemQueue = containerAPI.getSystemQueueInstance(manifest.id);
    this.systemQueue.register(ImportContent.taskType, ImportContent);
    this.dbSDK.initialize(manifest.id);
  }

  public async add(ecarPaths: string[]): Promise<string[]> {
    ecarPaths = await this.getUnregisteredEcars(ecarPaths);
    logger.info("Unregistered Ecars:", ecarPaths);
    if (!ecarPaths || !ecarPaths.length) {
      throw {
        errCode: "ECARS_ADDED_ALREADY",
        errMessage: "All ecar are added to content manager",
      };
    }
    const queueReq: SystemQueueReq[] = [];
    for (const ecarPath of ecarPaths) {
      const contentSize = await this.getEcarSize(ecarPath).catch(handelError("ECAR_NOT_EXIST"));
      const insertData: SystemQueueReq = {
        type: ImportContent.taskType,
        name: path.basename(ecarPath),
        group: "CONTENT_MANAGER",
        metaData: {
          contentSize,
          ecarSourcePath: ecarPath,
          step: ImportSteps.copyEcar,
          extractedEcarEntries: {},
          artifactUnzipped: {},
        },
      };
      queueReq.push(insertData);
    }
    const ids = await this.systemQueue.add(queueReq);
    // _.forEach(ids, (id, index) => {
    //   this.logSubmitAuditEvent(id, queueReq[index].name, Object.keys(queueReq[index]));
    // });
    return ids;
  }

  public async pauseImport(importId: string) {
    return this.systemQueue.pause(importId);
  }

  public async resumeImport(importId: string) {
    return this.systemQueue.resume(importId);
  }

  public async cancelImport(importId: string) {
    return this.systemQueue.cancel(importId);
  }

  public async retryImport(importId: string) {
    return this.systemQueue.retry(importId);
  }

  private getEcarSize(filePath): Promise<number> {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        resolve(stats.size);
      });
    });
  }

  private async getUnregisteredEcars(ecarPaths: string[]): Promise<string[]> {
    const registeredJobs = await this.systemQueue.query({
      type: ImportContent.taskType,
      name: { $in: ecarPaths.map((ecarPath) => path.basename(ecarPath))},
      isActive: true,
    });
    if (!registeredJobs) {
      return ecarPaths;
    }
    ecarPaths = _.filter(ecarPaths, (ecarPath) => {
      if (this.findPath(registeredJobs.docs,  ecarPath )) {
        return false;
      } else {
        return true;
      }
    });
    return ecarPaths;
  }
  private findPath(docs, filePath: string) {
    const exist = _.find(docs, (o: any) => {
      return o.metaData.sourcePath === filePath;
    });
    if (exist) { return true; }
    return false;
  }
}
