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
    //TODO: need to be implemented
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