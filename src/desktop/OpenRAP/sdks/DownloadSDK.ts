import { Singleton } from 'typescript-ioc'
import * as path from 'path';
const { SuDScheduler } = require("su-downloader3");
const SuDSchedulerOptions = {
  autoStart: true,
  maxConcurrentDownloads: 1,
  downloadOptions: {
    threads: 1, // TODO: if threads are more than one the unzip is failing due to partials combined
    throttleRate: 2000,
    timeout: 60000
  }
};
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
export class DownloadSDK {

  private suDScheduler = new SuDScheduler(SuDSchedulerOptions);

  public queueDownload(id, locations: { url: string, savePath: string }, observer){
    return this.suDScheduler.queueDownload(id, locations, observer)
  }

  public pause(id: string, stop = true): boolean {
    return this.suDScheduler.pauseDownload(id, stop);
  };

  public cancel(id: string) {
    return this.suDScheduler.killDownload(id);
  };

}