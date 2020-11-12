var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@project-sunbird/ext-framework-server/api");
const logger_1 = require("@project-sunbird/logger");
const EventManager_1 = require("@project-sunbird/ext-framework-server/managers/EventManager");
const bodyParser = require("body-parser");
const express = require("express");
const routes_spec_data_1 = require("./routes.spec.data");
class ConnectToServer {
    constructor() {
        this.expressApp = express();
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const subApp = express();
            subApp.use(bodyParser.json({ limit: "100mb" }));
            this.expressApp.use("/", subApp);
            routes_spec_data_1.frameworkConfig.db.pouchdb.path = process.env.DATABASE_PATH;
            routes_spec_data_1.frameworkConfig.logBasePath = __dirname;
            yield api_1.frameworkAPI
                .bootstrap(routes_spec_data_1.frameworkConfig, subApp);
            yield new Promise((resolve, reject) => {
                this.app = this.expressApp.listen(process.env.APPLICATION_PORT, (error) => {
                    if (error) {
                        logger_1.logger.error("errrror", error);
                        reject(error);
                    }
                    else {
                        logger_1.logger.info("app is started on port " + process.env.APPLICATION_PORT);
                        resolve();
                    }
                });
            });
            yield new Promise((resolve) => {
                EventManager_1.EventManager.subscribe("openrap-sunbirded-plugin:initialized", () => {
                    resolve();
                });
            });
            return this.expressApp;
        });
    }
    close() {
        this.app.close(() => {
            logger_1.logger.info(`Server Disconnected`);
        });
    }
}
exports.ConnectToServer = ConnectToServer;
