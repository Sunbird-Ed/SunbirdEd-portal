import { manifest }  from "./../manifest";
import Telemetry from "./../controllers/telemetry";
import * as _ from "lodash";
export default (app) => {
    const telemetry = new Telemetry(manifest);
    app.post(
        ["/content/data/v1/telemetry", "/action/data/v3/telemetry"],
        (req, res) => {
          telemetry.addEvents(req, res);
        },
      );
    app.get("/api/telemetry/v1/info", (req, res) => {
        if (_.get(req, "query.syncConfig") === "true") {
            telemetry.getTelemetrySyncSetting(req, res);
        } else {
            telemetry.getInfo(req, res);
        }
    });
    app.post("/api/telemetry/v1/export", telemetry.export.bind(telemetry));
    app.post("/api/telemetry/v1/import", telemetry.import.bind(telemetry));
    app.post("/api/telemetry/v1/import/retry/:importId", telemetry.retryImport.bind(telemetry));
    app.post("/api/telemetry/v1/list", telemetry.list.bind(telemetry));
    app.post("/api/telemetry/v1/config", telemetry.setTelemetrySyncSetting.bind(telemetry));
    app.post("/api/desktop/v1/sync", telemetry.sync.bind(telemetry));
}