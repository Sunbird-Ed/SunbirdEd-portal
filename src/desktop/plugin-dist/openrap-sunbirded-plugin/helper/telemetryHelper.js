Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const telemetryInstance = api_1.containerAPI.getTelemetrySDKInstance().getInstance();
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
class TelemetryHelper {
    logShareEvent(shareItems, dir, telemetryEnv) {
        const telemetryEvent = {
            context: {
                env: telemetryEnv,
            },
            edata: {
                dir,
                type: "File",
                items: shareItems,
            },
        };
        telemetryInstance.share(telemetryEvent);
    }
    logSearchEvent(edata, telemetryEnv) {
        const telemetryEvent = {
            context: {
                env: telemetryEnv,
            },
            edata: {
                type: _.get(edata, "type"),
                query: _.get(edata, "query") || "",
                filters: _.get(edata, "filters") || {},
                sort: _.get(edata, "sort") || {},
                correlationid: _.get(edata, "correlationid") || "",
                size: _.get(edata, "size"),
                topn: _.get(edata, "topn") || [{}],
            },
        };
        telemetryInstance.search(telemetryEvent);
    }
}
exports.default = TelemetryHelper;
