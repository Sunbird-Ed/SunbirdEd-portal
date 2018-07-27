Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("@project-sunbird/ext-framework-server/Util");
const _ = require("lodash");
class FormResponse {
    constructor(error, result) {
        this.responseCode = "";
        this.result = {};
        this.id = _.get(result, 'id') || _.get(error, 'id');
        this.ver = "1.0";
        this.ts = new Date();
        this.params = {
            resmsgid: Util_1.Util.UUID(),
            msgid: Util_1.Util.UUID()
        };
        if (error) {
            this.params.status = "failed";
            this.params.err = error.err;
            this.params.errmsg = error.errmsg;
            this.responseCode = error.responseCode || "SERVER_ERROR";
        }
        if (result) {
            this.params.status = "successful";
            this.responseCode = "OK";
            this.result = result.data;
        }
        // order the object keys for response
        return Object.keys(this).sort().reduce((r, k) => (r[k] = this[k], r), {});
    }
}
exports.FormResponse = FormResponse;
