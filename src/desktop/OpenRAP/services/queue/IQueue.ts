export interface IQueue {
    _id?: string;
    type: string,
    priority: number;
    createdOn: number;
    updatedOn: number;
}

export interface ISystemQueue extends IQueue {
  _rev?: string;
  group?: string;
  plugin: string;
  status: SystemQueueStatus;
  failedCode?: string;
  isActive: boolean;
  failedReason?: string;
  name: string;
  runTime: number;
  progress: number;
  metaData: any;
}
export interface INetworkQueue extends IQueue {
    pathToApi: string;
    requestHeaderObj: object;
    requestBody: any;
    bearerToken: boolean;
    subType: string;
    size?: number;
    count?: number;
    data?: any;
}

export interface INetworkQueueQuery {
    selector: {
        _id?: string;
        type?: string;
        subType?: any;
    };
    limit?: number;
}
export enum SystemQueueStatus {
  reconcile = "reconcile",
  resume = "resume",
  inQueue = "inQueue",
  inProgress = "inProgress",
  pausing = "pausing",
  paused = "paused",
  canceling = "canceling",
  canceled = "canceled",
  completed = "completed",
  failed = "failed",
}
export interface IUpdateQuery {
    updatedOn: number;
}
