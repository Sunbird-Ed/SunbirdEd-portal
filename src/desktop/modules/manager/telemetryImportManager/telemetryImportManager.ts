import * as fs from "fs";
import * as  _ from "lodash";
import { Singleton } from "typescript-ioc";
import * as path from "path";
import { handelError } from "./ITelemetryImport";
import { logger } from "@project-sunbird/logger";
import { containerAPI, ISystemQueueInstance, SystemQueueReq } from "@project-sunbird/OpenRAP/api";
import { manifest } from "../../manifest";
import { ImportTelemetry } from "./telemetryImport";
@Singleton
export class TelemetryImportManager {
  private systemQueue: ISystemQueueInstance;

  public async initialize() {
    this.systemQueue = containerAPI.getSystemQueueInstance(manifest.id);
    this.systemQueue.register(ImportTelemetry.taskType, ImportTelemetry);
  }

  public async add(paths: string[]): Promise<string[]> {
    paths = await this.getUnregisteredPaths(paths);
    logger.info("Unregistered telemetry import paths:", paths);
    if (!paths || !paths.length) {
      throw {
        errCode: "TELEMETRY_IMPORT_PATH_ADDED_ALREADY",
        errMessage: "All telemetry import paths are added",
      };
    }
    const queueReq: SystemQueueReq[] = [];
    for (const data of paths) {
      const fileSize = await this.getFileSize(data).catch(handelError("TELEMETRY_IMPORT_PATH_NOT_EXIST"));
      const insertData: SystemQueueReq = {
        type: ImportTelemetry.taskType,
        name: path.basename(data),
        metaData: {
          fileSize,
          sourcePath: data,
        },
      };
      queueReq.push(insertData);
    }
    const ids = await this.systemQueue.add(queueReq);
    return ids;
  }

  public async retryImport(importId: string) {
    return this.systemQueue.retry(importId);
  }

  private getFileSize(filePath): Promise<number> {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        resolve(stats.size);
      });
    });
  }

  private async getUnregisteredPaths(paths: string[]): Promise<string[]> {
    const registeredJobs = await this.systemQueue.query({
      type: ImportTelemetry.taskType,
      name: { $in: paths.map((data) => path.basename(data)) },
      isActive: true,
    });
    if (!registeredJobs) {
      return paths;
    }
    logger.debug("---paths--", paths);
    paths = _.filter(paths, (filePath) => {
      if (this.findPath(registeredJobs.docs, filePath)) {
        logger.info("skipping telemetry import for ", filePath, " as its already registered");
        return false;
      } else {
        return true;
      }
    });
    return paths;
  }

  private findPath(docs, filePath: string) {
    const exist = _.find(docs, (o: any) => {
      return o.metaData.sourcePath === filePath;
    });
    if (exist) { return true; }
    return false;
  }
}
