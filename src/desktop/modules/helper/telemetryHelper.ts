import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";

import { ClassLogger } from "@project-sunbird/logger/decorator";

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
export default class TelemetryHelper {

    telemetryInstance;
    public logShareEvent(shareItems: object[], dir: string, telemetryEnv: string) {
        if(!this.telemetryInstance) {
            this.telemetryInstance = containerAPI.getTelemetrySDKInstance().getInstance();
        }
        const telemetryEvent: any = {
            context: {
                env: telemetryEnv,
            },
            edata: {
                dir,
                type: "File",
                items: shareItems,
            },
        };
        this.telemetryInstance.share(telemetryEvent);
    }

    public logSearchEvent(edata: {}, telemetryEnv: string) {
        if(!this.telemetryInstance) {
            this.telemetryInstance = containerAPI.getTelemetrySDKInstance().getInstance();
        }
        const telemetryEvent: any = {
            context: {
                env: telemetryEnv,
            },
            edata: {
                type: _.get(edata, "type"),
                query: _.get(edata, "query") || "",
                filters: _.get(edata, "filters") || {},
                sort: _.get(edata, "sort") || {},
                correlationid:  _.get(edata, "correlationid") || "",
                size:  _.get(edata, "size"),
                topn:  _.get(edata, "topn") || [{}],
            },
        };
        this.telemetryInstance.search(telemetryEvent);
    }
}
