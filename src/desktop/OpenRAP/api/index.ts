/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */

import { Singleton, Inject } from "typescript-ioc";
import { App } from "./../index";
import { PluginConfig } from "./../interfaces";
import { register } from "./../sdks/GlobalSDK";
import SettingSDK from "./../sdks/SettingSDK";
import FileSDK from "./../sdks/FileSDK";
import NetworkSDK from "./../sdks/NetworkSDK";
import SystemSDK from "./../sdks/SystemSDK";
import TelemetrySDK from "./../sdks/TelemetrySDK";
import { UserSDK } from "./../sdks/UserSDK";
import { TicketSDK } from "./../sdks/TicketSDK";
import { DownloadSDK } from "./../sdks/DownloadSDK";
import DeviceSDK from "./../sdks/DeviceSDK";
import { SystemQueue, TaskExecuter, SystemQueueReq, SystemQueueQuery, ISystemQueue, NetworkQueue, NetworkQueueReq } from './../services/queue';
export { ITaskExecuter, SystemQueueQuery, ISystemQueue, SystemQueueReq, SystemQueueStatus, NetworkQueueReq } from "./../services/queue";
import { EventManager } from "./../managers/EventManager";
import { INetworkQueueQuery } from './../services/queue/IQueue';
import { PerfLogger, IPerfLog } from './../services/perfLogger';
import { StandardLogger } from '../services/standardLogger/standardLogger';
export * from './../services/perfLogger/IPerfLog'

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
@Singleton
class ContainerAPI {
  @Inject userSDK : UserSDK;
  @Inject ticketSDK : TicketSDK;
  @Inject systemQueue: SystemQueue
  @Inject networkQueue: NetworkQueue
  @Inject downloadSDK: DownloadSDK
  @Inject deviceSDK: DeviceSDK
  @Inject private perfLogger: PerfLogger;
  @Inject private standardLogger: StandardLogger;
  public async bootstrap() {
    await App.bootstrap();
    EventManager.subscribe("app:initialized", () => {
      this.systemQueue.initialize();
      this.perfLogger.initialize();
    });
  }

  public async register(pluginId: string, pluginInfo: PluginConfig) {
    await register(pluginId, pluginInfo);
  }

  // get the Setting SDK by plugin

  public getSettingSDKInstance(pluginId: string) {
    return new SettingSDK(pluginId);
  }

  // get file SDK by plugin

  public getFileSDKInstance(pluginId: string, customPath?: string): FileSDK {
    return new FileSDK(pluginId, customPath);
  }
  public getDownloadSdkInstance(){
    return this.downloadSDK;
  }
  public getPerfLoggerInstance(): PerfLogger {
    return this.perfLogger;
  }
  public getStandardLoggerInstance(): StandardLogger {
    return this.standardLogger;
  }
  // get the Network SDK

  public async getNetworkStatus(url?: string): Promise<boolean> {
    let networkSDK = new NetworkSDK();
    let status: boolean = await networkSDK.isInternetAvailable(url);
    return status;
  }

  public getSystemSDKInstance(pluginId?: string): SystemSDK {
    return new SystemSDK(pluginId);
  }

  public getTelemetrySDKInstance() {
    return new TelemetrySDK();
  }

  public getUserSdkInstance(){
    return this.userSDK;
  }
  public getTicketSdkInstance(){
    return this.ticketSDK;
  }
  public initializeSystemQueue(){
    this.systemQueue.initialize();
  }

  public getDeviceSdkInstance(){
    return this.deviceSDK;
  }

  public getSystemQueueInstance(pluginId: string): ISystemQueueInstance{
    const register = (type: string, taskExecuter: TaskExecuter) => {
      return this.systemQueue.register(pluginId, type, taskExecuter);
    }
    const add = (tasks: SystemQueueReq[] | SystemQueueReq) => {
      return this.systemQueue.add(pluginId, tasks);
    }
    const query = (query: SystemQueueQuery, sort?: any) => {
      return this.systemQueue.query(pluginId, query, sort);
    }
    const pause = (_id: string) => {
      return this.systemQueue.pause(pluginId, _id);
    }
    const resume = (_id: string) => {
      return this.systemQueue.resume(pluginId, _id);
    }
    const cancel = (_id: string) => {
      return this.systemQueue.cancel(pluginId, _id);
    }
    const retry = (_id: string) => {
      return this.systemQueue.retry(pluginId, _id);
    }
    const migrate = (tasks: ISystemQueue[]) => {
      return this.systemQueue.migrate(tasks);
    }
    return { register, add, query, pause, resume, cancel, retry, migrate }
  }

  public getNetworkQueueInstance() {
    return this.networkQueue;
  }
}
export interface ISystemQueueInstance {
  register(type: string, taskExecuter: TaskExecuter); 
  add(tasks: SystemQueueReq[] | SystemQueueReq);
  query(query: SystemQueueQuery, sort?: any);
  pause(_id: string); 
  resume(_id: string);
  cancel(_id: string);
  retry(_id: string);
  migrate(tasks: ISystemQueue[]);
}
export const containerAPI = new ContainerAPI();
