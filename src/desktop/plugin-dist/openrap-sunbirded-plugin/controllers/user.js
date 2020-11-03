var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const response_1 = require("../utils/response");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
class User {
    constructor(manifest) {
        this.userSDK = api_1.containerAPI.getUserSdkInstance();
        this.settingSDK = api_1.containerAPI.getSettingSDKInstance(manifest.id);
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_.get(req, "body.request")) {
                    res.status(400);
                    return res.send(response_1.default.error("api.desktop.user.read", 400, "Request object is required"));
                }
                const createResp = yield this.userSDK.create(_.get(req, "body.request"));
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": request: ${_.get(req, "body.request")} found from desktop app update api`);
                return res.send(response_1.default.success("api.desktop.user.create", { id: createResp._id }, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while adding user,  where err = ${err}`);
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.desktop.user.create", err.status || 500, err.message || ""));
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.userSDK.read();
                const locationData = yield this.settingSDK.get("location");
                userData.location = locationData;
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": result: ${userData} found from desktop app update api`);
                return res.send(response_1.default.success("api.desktop.user.read", userData, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting user,  where err = ${err}`);
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.desktop.user.read", err.status || 500, err.message || ""));
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqObj = _.get(req.body, "request");
                reqObj._id = _.get(reqObj, "identifier");
                logger_1.logger.info(`ReqId =  ${req.headers["X-msgid"]}: updating user  data in user Sdk`);
                yield this.userSDK.update(reqObj);
                res.status(200);
                return res.send(response_1.default.success("api.desktop.user.update", { identifier: reqObj._id }, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while updating in user  database and err.message: ${err.message} ${err}`);
                if (err.status === 404) {
                    res.status(404);
                    return res.send(response_1.default.error("api.desktop.user.update", 404));
                }
                else {
                    const status = err.status || 500;
                    res.status(status);
                    return res.send(response_1.default.error("api.desktop.user.update", status));
                }
            }
        });
    }
}
exports.default = User;
