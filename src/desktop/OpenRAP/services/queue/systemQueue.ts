import { Singleton } from "typescript-ioc";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import { DataBaseSDK } from "../../sdks/DataBaseSDK";
import { ISystemQueue, SystemQueueStatus } from './IQueue';
import { logger } from "@project-sunbird/logger";
import { v4 as uuid } from 'uuid';
import { Subject, Observer, asyncScheduler, Observable } from "rxjs";
import { throttleTime, mergeMap } from "rxjs/operators";
import { TelemetryInstance } from './../telemetry/telemetryInstance';
export { ISystemQueue } from './IQueue';
import { EventManager } from "./../../managers/EventManager";
const DEFAULT_CONCURRENCY = {
  "openrap-sunbirded-plugin_IMPORT": 1,
  "openrap-sunbirded-plugin_DOWNLOAD": 1,
  "openrap-sunbirded-plugin_DELETE": 1,
  default: 1
}
@Singleton 
export class SystemQueue {
  public static taskCompleteEvent =  "SystemQueue:TASK_COMPLETE";
  @Inject private dbSDK: DataBaseSDK;
  @Inject private telemetryInstance: TelemetryInstance;
  private dbName = 'system_queue';
  private registeredTasks: { [task: string]: RegisteredTasks } = {};
  private runningTasks: IRunningTasks[] =  [];
  private lockTaskExecuter = false;
  private config = {
    concurrency: DEFAULT_CONCURRENCY
  };
  /**
   * method to initializes system queue.
   * This method should be called after all plugin and app are initialized
   * @param config 
   */
  public async initialize(config?: any) {
    // this.config = config; TODO: support configurable concurrency
    logger.debug("System queue is being initialized");
    const { docs } = await this.dbSDK.find(this.dbName, { selector: { status: SystemQueueStatus.inProgress} })
    .catch((err) => {
      logger.error("reconcile error while fetching inProgress content from DB", err.message);
      return { docs: [] };
    });
    logger.info("length of inProgress jobs found while reconcile", docs.length);
    if (docs.length) { // reconcile
      const updateQuery: ISystemQueue[] = _.map(docs, (job: ISystemQueue) => {
        job.status = SystemQueueStatus.reconcile;
        return job;
      });
      await this.dbSDK.bulkDocs(this.dbName, updateQuery)
        .catch((err) => logger.error("reconcile error while updating status to DB", err.message));
    }
    this.executeNextTask();
    setInterval(this.trackTaskProgress, 1000);
  }
  /**
   * method to track progress of task.
   * this method will stop the task for which progress is not updated for configured time
   * and pick next task in queue
   */
  private trackTaskProgress(){
    //TODO: implement progress track method
  }
  /**
   * method to register task with taskExecuters.
   * @param plugin 
   * @param type 
   * @param taskExecuter 
   * @param supportedActions 
   */
  public register(plugin: string, type: string, taskExecuter: TaskExecuter, supportedActions?: string[]){
    if(!plugin || !type || !taskExecuter){
      logger.error('Task was not registered because of missing mandatory fields', plugin, type, taskExecuter);
      return;
    }
    if(this.registeredTasks[`${plugin}_${type}`]){
      logger.warn('SystemQueue is overriding already registered Task for', `${plugin} ${type}`, 'with new handler', taskExecuter);
    }
    this.registeredTasks[`${plugin}_${type}`] = {
      plugin,
      type,
      taskExecuter,
      supportedActions
    };
  }
  /**
   * method to add task to queue. 
   * In order for SystemQueue to execute a task, executer for the same should already be registered by plugin.
   * @param plugin 
   * @param tasks 
   */
  public async add(plugin: string, tasks: SystemQueueReq[] | SystemQueueReq): Promise<string[] | SystemQueueError> {
    if(_.isEmpty(tasks)){
      throw {
        code: "TASK_DATA_MISSING",
        status: 400,
        message: "Task data is missing or empty"
      }
    }
    tasks = _.isArray(tasks) ? tasks : [tasks]
    const queueData: ISystemQueue[] = tasks.map((task, index) => ({
      ...task,
      _id: uuid(),
      createdOn: Date.now() + index, 
      updatedOn: Date.now() + index,
      status: SystemQueueStatus.inQueue,
      progress: 0,
      plugin,
      priority: 1,
      runTime: 0,
      isActive: true,
    }));
    // Add audit event for newly added queue data
    for (const data of queueData) {
      this.logAuditEvent(data, Object.keys(data), SystemQueueStatus.inQueue);
    }

    logger.info("Adding to queue for", plugin, queueData.length);
    await this.dbSDK.bulkDocs(this.dbName, queueData)
    .catch((err) => logger.error("SystemQueue, Error while adding task in db", err.message));
    this.executeNextTask();
    return queueData.map(({_id}) => _id);
  }
  private async executeNextTask(){
    logger.debug("executeNextTask method called", this.lockTaskExecuter, this.runningTasks);
    if(this.lockTaskExecuter){ // prevent picking of same task more than once(for handling race condition)
      return;
    }
    try {
      // TODO: should support all configs, currently only supports task concurrency
      this.lockTaskExecuter = true;
      const fetchQuery: { plugin: string, type: string }[] = [];
      let groupedRunningTask: { [task: string]: IRunningTasks[] } = _.groupBy(this.runningTasks, (task) => `${task.plugin}_${task.type}`)
      _.forIn(this.registeredTasks, (value, key) => {
        const concurrency = this.config.concurrency[key] || this.config.concurrency.default;
        if((_.get(groupedRunningTask[key], 'length') || 0) < concurrency){
          fetchQuery.push({plugin: value.plugin, type: value.type});
        }
      });
      logger.debug("Fetch query for system queue execution", fetchQuery, groupedRunningTask);
      if(!fetchQuery.length){
        this.lockTaskExecuter = false;
        return;
      }
      const selector = { // TODO: should limit task query at plugin/type level
        status: { $in: [SystemQueueStatus.inQueue, SystemQueueStatus.resume, SystemQueueStatus.reconcile] },
        plugin: { $in: fetchQuery.map(data => data.plugin) },
        type: { $in: fetchQuery.map(data => data.type) }
      }
      const { docs } = await this.dbSDK.find(this.dbName, { selector: selector }) // sort: ["createdOn"]
      .catch((err) => {
        logger.error("Error while fetching queued jobs in pickNextTask", err.message);
        return { docs: [] };
      });
      if(!docs || !docs.length){
        this.lockTaskExecuter = false;
        return;
      }
      groupedRunningTask = _.groupBy(this.runningTasks, (task) => `${task.plugin}_${task.type}`);
      logger.debug("Docs found during execution", docs.length, groupedRunningTask);
      let queuedTaskIndex = 0;
      while (docs[queuedTaskIndex]) {
        const task: ISystemQueue = docs[queuedTaskIndex];
        const taskExecuter: TaskExecuter = _.get(this.registeredTasks[`${task.plugin}_${task.type}`], 'taskExecuter');
        const runningTaskCount = (_.get(groupedRunningTask[`${task.plugin}_${task.type}`], 'length') || 0);
        const concurrency = this.config.concurrency[`${task.plugin}_${task.type}`] || this.config.concurrency.default;
        if(taskExecuter && (runningTaskCount < concurrency)){
          const taskExecuterRef = new taskExecuter();
          const syncFunc = this.getTaskSyncFun(task);
          const observer = this.getTaskObserver(task, syncFunc);
          task.status = SystemQueueStatus.inProgress;
          task.progress = 0;
          syncFunc.next(task);
          taskExecuterRef.start(task, observer);
          const runningTaskRef = {
            _id: task._id,
            type: task.type,
            plugin: task.plugin,
            taskExecuterRef,
            startTime: Date.now(),
            lastKnowProgress: task.progress,
            lastKnowProgressUpdatedTime: Date.now(),
            syncFunc,
          };
          this.runningTasks.push(runningTaskRef);
          if(!groupedRunningTask[`${task.plugin}_${task.type}`]){
            groupedRunningTask[`${task.plugin}_${task.type}`] = []
          } 
          groupedRunningTask[`${task.plugin}_${task.type}`].push(runningTaskRef);
          logger.debug("Executing task ", runningTaskRef._id, runningTaskRef.type, runningTaskRef.plugin);
        } else if (!taskExecuter) {
          // TODO: fail all task which doesn't have task Executers
          logger.error('TaskExecuter not found for task', task.plugin, task.type);
        }
        queuedTaskIndex++;
      }
    } catch(err) {
      logger.error("Error while executing task", err.message);
    } finally {
      this.lockTaskExecuter = false;
      logger.info("exited executeNextTask method");
    }
  }
  private getTaskSyncFun(taskData: ISystemQueue): Subject<ISystemQueue> {
    const syncData$ = new Subject<ISystemQueue>();
    const updateDbObservable = (data) => {
      return new Observable(subscriber => {
        data._id = taskData._id;
        delete data._rev;
        this.dbSDK.updateDoc(this.dbName, taskData._id, data)
        .then(data => {
          taskData._rev = data.rev;
          subscriber.complete();
          return taskData._rev = data.rev
        })
        .catch(err => {
          subscriber.complete();
          logger.error("Error while update doc for task", taskData._id, err.message);
        });
      })
    }
    syncData$.pipe(throttleTime(500, asyncScheduler, { leading: true, trailing: true }),
      mergeMap(data => updateDbObservable(data))
    ).subscribe((data) => {
      // updateDb(data);
    }, error => {
      // updateDb(taskData);
    }, () => {
      _.remove(this.runningTasks, (job) => job._id === taskData._id);
      this.executeNextTask(); 
    });
    return syncData$;
  }
  private getTaskObserver(queueCopy: ISystemQueue, syncFun: Subject<ISystemQueue>): Observer<ISystemQueue> {
    const next = (data: ISystemQueue) => {
      queueCopy = data;
      const runningTaskRef = _.find(this.runningTasks, {_id: queueCopy._id});
      queueCopy.runTime = runningTaskRef ? queueCopy.runTime + (Date.now() - runningTaskRef.lastKnowProgressUpdatedTime)/1000: queueCopy.runTime;
      if(runningTaskRef){
        runningTaskRef.lastKnowProgressUpdatedTime = Date.now();
      }
      syncFun.next(queueCopy);
    };
    const error = (err: SystemQueueError) => {
      queueCopy.status = SystemQueueStatus.failed;
      queueCopy.failedCode = err.code;
      queueCopy.failedReason = err.message;
      queueCopy.isActive = false;
      const runningTaskRef = _.find(this.runningTasks, {_id: queueCopy._id});
      queueCopy.runTime = runningTaskRef ? queueCopy.runTime + (Date.now() - runningTaskRef.lastKnowProgressUpdatedTime)/1000: queueCopy.runTime;
      if(runningTaskRef){
        runningTaskRef.lastKnowProgressUpdatedTime = Date.now();
      }
      syncFun.next(queueCopy);
      syncFun.complete();
    };
    const complete = () => {
      queueCopy.progress = 100;
      queueCopy.isActive = false;
      queueCopy.status = SystemQueueStatus.completed;
      const runningTaskRef = _.find(this.runningTasks, {_id: queueCopy._id});
      queueCopy.runTime = runningTaskRef ? queueCopy.runTime + (Date.now() - runningTaskRef.lastKnowProgressUpdatedTime)/1000: queueCopy.runTime;
      if(runningTaskRef){
        runningTaskRef.lastKnowProgressUpdatedTime = Date.now();
      }
      syncFun.next(queueCopy);
      syncFun.complete();
      EventManager.emit(SystemQueue.taskCompleteEvent, queueCopy); // used in perf log generation
    };
    return { next, error, complete };
  }
  public query(plugin: string, query: SystemQueueQuery, sort?: any){
    const selector = { ...query, plugin};
    return this.dbSDK.find(this.dbName, { selector: selector })
  }
  public async pause(plugin: string, _id: string){
    const inProgressJob: IRunningTasks = _.find(this.runningTasks, { _id });
    if(inProgressJob){
      const res = await inProgressJob.taskExecuterRef.pause();
      if(res !== true){
        throw res || "INVALID_OPERATION";
      }
      const queueData = inProgressJob.taskExecuterRef.status();
      // Adding telemetry audit event
      this.logAuditEvent(queueData, ["status", "updatedOn"], SystemQueueStatus.paused, queueData.status);
      queueData.status = SystemQueueStatus.paused;
      inProgressJob.syncFunc.next(queueData);
      inProgressJob.syncFunc.complete();
    } else {
      const dbResults: ISystemQueue = await this.dbSDK.getDoc(this.dbName, _id)
      .catch((err) => logger.error("pause error while fetching job details for ", _id));
      if (!dbResults || _.includes([SystemQueueStatus.canceled, SystemQueueStatus.completed, SystemQueueStatus.failed,	
        SystemQueueStatus.pausing, SystemQueueStatus.canceling], dbResults.status)) {	
          throw "INVALID_OPERATION";	
      }
      // Adding telemetry audit event
      this.logAuditEvent(dbResults, ["status", "updatedOn"], SystemQueueStatus.paused, dbResults.status);
      dbResults.status = SystemQueueStatus.paused;
      await this.dbSDK.updateDoc(this.dbName, _id, dbResults)
      .catch((err) => logger.error("pause error while updating job details for ", _id));
      this.executeNextTask();
    }
  }
  public async resume(plugin: string, _id: string){
    const dbResults: ISystemQueue = await this.dbSDK.getDoc(this.dbName, _id)
    .catch((err) => logger.error("resume error while fetching job details for ", _id));
    if (!dbResults || !_.includes([SystemQueueStatus.paused], dbResults.status)) {	
      throw "INVALID_OPERATION";	
    }
    // Adding telemetry audit event
    this.logAuditEvent(dbResults, ["status", "updatedOn"], SystemQueueStatus.resume, dbResults.status);
    dbResults.status = SystemQueueStatus.resume;	
    await this.dbSDK.updateDoc(this.dbName, _id, dbResults)	
      .catch((err) => logger.error("resume error while updating job details for ", _id));
    this.executeNextTask();
  }
  public async cancel(plugin: string, _id: string){
    const inProgressJob: IRunningTasks = _.find(this.runningTasks, { _id });
    if(inProgressJob){
      const res = await inProgressJob.taskExecuterRef.cancel();
      if(res !== true){
        throw res || "INVALID_OPERATION";
      }
      const queueData = inProgressJob.taskExecuterRef.status();
      // Adding telemetry audit event
      this.logAuditEvent(queueData, ["status", "updatedOn"], SystemQueueStatus.canceled, queueData.status);
      queueData.status = SystemQueueStatus.canceled;
      queueData.isActive = false;
      inProgressJob.syncFunc.next(queueData);
      inProgressJob.syncFunc.complete();
    } else {
      const dbResults: ISystemQueue = await this.dbSDK.getDoc(this.dbName, _id)
      .catch((err) => logger.error("cancel error while fetching job details for ", _id));
      if (!dbResults || _.includes([SystemQueueStatus.canceled, SystemQueueStatus.completed, SystemQueueStatus.failed,	
        SystemQueueStatus.pausing, SystemQueueStatus.canceling], dbResults.status)) {	
          throw "INVALID_OPERATION";	
      }
      // Adding telemetry audit event
      this.logAuditEvent(dbResults, ["status", "updatedOn"], SystemQueueStatus.canceled, dbResults.status);
      dbResults.status = SystemQueueStatus.canceled;
      await this.dbSDK.updateDoc(this.dbName, _id, dbResults)
      .catch((err) => logger.error("cancel error while updating job details for ", _id));
      this.executeNextTask();
    }
  }
  public async retry(plugin: string, _id: string){
    const dbResults: ISystemQueue = await this.dbSDK.getDoc(this.dbName, _id)
    .catch((err) => logger.error("retry error while fetching job details for ", _id));
    if (!dbResults || !_.includes([SystemQueueStatus.failed], dbResults.status)) {	
      throw "INVALID_OPERATION";	
    }
    // Adding telemetry audit event
    this.logAuditEvent(dbResults, ["status", "updatedOn"], SystemQueueStatus.inQueue, dbResults.status);
    dbResults.status = SystemQueueStatus.inQueue;	
    await this.dbSDK.updateDoc(this.dbName, _id, dbResults)	
      .catch((err) => logger.error("retry error while updating job details for ", _id));
    this.executeNextTask();
  }
  //TODO: support custom actions

  // TODO: Need to remove this in next release 
  public async migrate(queueData: ISystemQueue[]) {
    if (_.isEmpty(queueData)) {
      throw {
        code: "TASK_DATA_MISSING",
        status: 400,
        message: "Task data is missing or empty"
      }
    }
    await this.dbSDK.bulkDocs(this.dbName, queueData)
      .catch((err) => logger.error("SystemQueue migration, Error while adding task in db", err.message));
    this.executeNextTask();
   return queueData.map(({ _id }) => _id);
  }
  private logAuditEvent(data: any, props: string[], state: string, prevstate?: string) {
    const telemetryEvent: any = {
      context: {
        env: 'systemQueue',
        cdata: [{
          id: _.get(data, '_id'),
          type: _.get(data, 'type'),
        }],
      },
      edata: {
        state,
        prevstate,
        props,
      },
    };
    if (_.get(data, 'metaData.contentId')) {
      telemetryEvent.object = {
        id: _.get(data, 'metaData.contentId'),
        type: "content",
        ver: _.toString(_.get(data, 'metaData.pkgVersion')),
      };
    }
    this.telemetryInstance.audit(telemetryEvent)
  }
}

interface IRunningTasks {
  _id: ISystemQueue['_id'];
  type: ISystemQueue['type'];
  plugin: ISystemQueue['plugin'];
  startTime: number;
  lastKnowProgress: number;
  lastKnowProgressUpdatedTime: number;
  taskExecuterRef: ITaskExecuter;
  syncFunc: any;
}

export interface ITaskExecuter {
  start(ISystemQueue: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean | SystemQueueError>;
  status(): ISystemQueue;
  pause?(): Promise<boolean | SystemQueueError>;
  resume?(ISystemQueue: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean | SystemQueueError>;
  cancel?(): Promise<boolean | SystemQueueError>;
  retry?(ISystemQueue: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean | SystemQueueError>;
}
export interface TaskExecuter {
  new(): ITaskExecuter;
}

export interface SystemQueueReq {
  type: ISystemQueue['type'];
  group?: ISystemQueue['group']; // ex: content_manager, telemetry etc
  metaData: ISystemQueue['metaData']; // any data required for 
  name: ISystemQueue['name']; // ex: ecar path for import, content identifier for download/delete
}

export interface SystemQueueError {
  code: string;
  status: number;
  message: string;
}

export interface SystemQueueQuery {
  _id?: ISystemQueue['_id'] | {$in: ISystemQueue['_id'][]};
  type?: ISystemQueue['type']| {$in: ISystemQueue['type'][]};
  group?: ISystemQueue['group'];
  name?: ISystemQueue['name'] | {$in: ISystemQueue['name'][]};
  isActive?: ISystemQueue['isActive']
  createdOn?: ISystemQueue['createdOn'] | {$gt: ISystemQueue['createdOn']}
  updatedOn?: ISystemQueue['updatedOn'] | {$gt: ISystemQueue['updatedOn']}
}

export interface RegisteredTasks {
  plugin: string;
  type: string;
  taskExecuter: TaskExecuter;
  supportedActions: any;
}
