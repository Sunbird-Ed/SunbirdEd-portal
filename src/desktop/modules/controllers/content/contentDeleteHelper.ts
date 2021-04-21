import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI, ISystemQueue, ITaskExecuter } from "@project-sunbird/OpenRAP/api";
import * as os from "os";
import * as path from "path";
import { Observer, of } from "rxjs";
import { retry } from "rxjs/operators";
import { manifest } from "../../manifest";

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
export class ContentDeleteHelper implements ITaskExecuter {
  public static taskType = "DELETE";
  public concurrency = 1;
  public queue = [];
  public running = 0;
  private contentDeleteData;
  private observer: Observer<ISystemQueue>;
  private systemQueue = containerAPI.getSystemQueueInstance(manifest.id);
  private fileSDK = containerAPI.getFileSDKInstance(manifest.id);
  private settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
  private prefixPath = this.fileSDK.getAbsPath("");
  private standardLog = containerAPI.getStandardLoggerInstance();

  public async start(contentDeleteData: ISystemQueue, observer: import("rxjs").Observer<ISystemQueue>) {
    this.observer  = observer;
    _.forEach(contentDeleteData.metaData.filePaths, async (filePath) => {
      await this.pushToQueue(filePath);
    });
    return true;
  }

  public status(): ISystemQueue {
    return this.contentDeleteData;
  }

  public async pushToQueue(filePath) {
    if (await this.checkPath(filePath)) {
        this.fileSDK = containerAPI.getFileSDKInstance(manifest.id, this.prefixPath);
        this.queue.push(filePath);
        this.next();
    }
  }

  private next() {
    while (this.queue.length) {
        const filePath = this.queue.shift();
        const deleteSub = of(this.fileSDK.remove(filePath)).pipe(retry(5));
        const deleteSubscription = deleteSub.subscribe({
                next: (val) => {
                    if (this.queue.length === 0) {
                      this.observer.complete();
                    }
                },
                error: (err) => {
                    this.observer.error(err);
                    this.standardLog.error({ id: 'CONTENT_DELETE_FAILED', message: `error while deleting the content and retried for 5 times`, error: err });
                },
              });
    }
  }
  private async checkPath(filePath: string) {
    const regex = /^content/i;

    if (os.platform() === "win32") {
      if (filePath.match(regex)) {
        try {
          const locationList: any = await this.settingSDK.get(`content_storage_location`);
          let i = 0;
          while (_.get(locationList, "location.length") && i < locationList.location.length) {
            const folderPath = path.join(locationList.location[i], filePath);
            const isDirExist = await this.fileSDK.isDirectoryExists(folderPath).catch((err) => console.log("Error while checking directory path"));
            if (isDirExist) {
              this.prefixPath = locationList.location[i];
              break;
            }
            i++;
          }

          return this.prefixPath && !_.includes(this.queue, filePath);
        } catch (error) {
          return this.prefixPath && !_.includes(this.queue, filePath);
        }
      } else {
        return false;
      }
    } else {
      return filePath.match(regex) && !_.includes(this.queue, filePath);
    }
  }
}
