"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const config_1 = require("../config");
const api_1 = require("../api");
class TestFramework {
    static initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let expressApp = express();
            process.on('unhandledRejection', (reason, p) => {
                console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            });
            expressApp.use(bodyParser.json({ limit: '50mb' }));
            config = Object.assign({}, config_1.defaultConfig, config);
            yield api_1.frameworkAPI.bootstrap(config, expressApp).then(() => {
                expressApp.listen(config.port);
                console.log(`=====> Application running on port: ${config.port}`);
            });
        });
    }
}
exports.TestFramework = TestFramework;
