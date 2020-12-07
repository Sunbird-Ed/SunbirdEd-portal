import { logger } from "@project-sunbird/logger";
import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";
import bodyParser = require("body-parser");
import * as express from "express";
import * as _ from "lodash";
import { frameworkConfig } from "./routes.spec.data";

export class ConnectToServer {
    public expressApp = express();
    public app;

    public async startServer() {
        const subApp = express();
        subApp.use(bodyParser.json({ limit: "100mb" }));
        this.expressApp.use("/", subApp);
        frameworkConfig.db.pouchdb.path = process.env.DATABASE_PATH;
        frameworkConfig.logBasePath = __dirname;
        // await frameworkAPI
        //     .bootstrap(frameworkConfig, subApp);
        await new Promise((resolve, reject) => {
            this.app = this.expressApp.listen(process.env.APPLICATION_PORT, (error: any) => {
                if (error) {
                    logger.error("errrror", error);
                    reject(error);
                } else {
                    logger.info("app is started on port " + process.env.APPLICATION_PORT);
                    resolve();
                }
            });
        });
        await new Promise((resolve) => {
            EventManager.subscribe("openrap-sunbirded-plugin:initialized", () => {
                resolve();
            });
        });
        return this.expressApp;
    }

    public close() {
        this.app.close(() => {
            logger.info(`Server Disconnected`);
        });
    }
}
