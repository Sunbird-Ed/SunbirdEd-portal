import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";
import { ISystemQueue, containerAPI } from "@project-sunbird/OpenRAP/api";
import * as _ from "lodash";
const perfLogger = containerAPI.getPerfLoggerInstance();
export default () => {
    const REQUIRED_SYSTEM_QUEUE_TASK = ["IMPORT", "DOWNLOAD", "DELETE"];

        EventManager.subscribe("SystemQueue:TASK_COMPLETE",
          (data: ISystemQueue) => {
          if (!_.includes(REQUIRED_SYSTEM_QUEUE_TASK, data.type)) {
              return;
          }
          if (_.includes(["IMPORT", "DOWNLOAD"], data.type)) {
            addPerfLogForImportAndDownload(data);
          } else if (data.type === "DELETE") {
            addPerfLogForDelete(data);
          }
        });
}

const addPerfLogForDelete = (data: ISystemQueue)  => {
    perfLogger.log({
      type: _.get(data, 'type'),
      time: _.get(data, 'runTime'),
      metaData: _.get(data, 'metaData')
    });
  } 

const addPerfLogForImportAndDownload = (data: ISystemQueue) => {
    let runTime: number = data.runTime;
    const contentSizeInMb: number = data.metaData.contentSize / 1e+6;
    runTime = runTime / contentSizeInMb;
    perfLogger.log({
      type: data.type,
      time: runTime,
      metaData: {},
    });
  }

export const addPerfLogForAPICall = (data:any) => {
  perfLogger.log({
    type: 'API',
    time: data.time,
    metaData: data.metaData
  });
}

