var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@project-sunbird/ext-framework-server/models");
const models_2 = require("./models");
const _ = require("lodash");
class Server extends models_1.BaseServer {
    constructor(manifest) {
        super(manifest);
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = _.pick(req.body.request, ['type', 'subType', 'action', 'rootOrgId', 'framework', 'data', 'component']);
            const model = new this.cassandra.instance.form_data({
                root_org: data.rootOrgId,
                type: data.type,
                subtype: data.subType,
                action: data.action,
                component: data.component,
                framework: data.framework,
                data: JSON.stringify(data.data),
                created: new Date()
            });
            yield model.saveAsync().then(data => {
                res.status(200)
                    .send(new models_2.FormResponse(undefined, {
                    id: 'api.form.create',
                    data: {
                        created: 'OK'
                    }
                }));
            })
                .catch(error => {
                res.status(500)
                    .send(new models_2.FormResponse({
                    id: "api.form.create",
                    err: "ERR_CREATE_FORM_DATA",
                    errmsg: error
                }));
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = _.pick(req.body.request, ['type', 'subType', 'action', 'rootOrgId', 'framework', 'data', 'component']);
            let query = {
                root_org: data.rootOrgId || '*',
                framework: data.framework || '*',
                type: data.type,
                action: data.action,
                subtype: data.subType || '*',
                component: data.component || '*'
            };
            const updateValue = {
                data: JSON.stringify(data.data),
                last_modified: new Date()
            };
            yield this.cassandra.instance.form_data.updateAsync(query, updateValue, { if_exists: true })
                .then(data => {
                if (!_.get(data, "rows[0].['[applied]']"))
                    throw { msg: `invalid request, no records found for the match to update!`, client_error: true };
                res.status(200)
                    .send(new models_2.FormResponse(undefined, {
                    id: 'api.form.update',
                    data: { "response": [{ "rootOrgId": query.root_org, "key": `${query.type}.${query.subtype}.${query.action}.${query.component}`, "status": "SUCCESS" }] }
                }));
            }).catch(error => {
                if (error.client_error) {
                    res.status(400)
                        .send(new models_2.FormResponse({
                        id: "api.form.update",
                        err: "ERR_UPDATE_FORM_DATA",
                        responseCode: "CLIENT_ERROR",
                        errmsg: error.msg
                    }));
                }
                else {
                    return error;
                }
            })
                .catch(error => {
                res.status(500)
                    .send(new models_2.FormResponse({
                    id: "api.form.update",
                    err: "ERR_UPDATE_FORM_DATA",
                    errmsg: error
                }));
            });
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = _.pick(req.body.request, ['type', 'subType', 'action', 'rootOrgId', 'framework', 'data', 'component']);
            let onRecordFound;
            const query = {
                root_org: data.rootOrgId,
                framework: data.framework,
                type: data.type,
                action: data.action,
                subtype: data.subType || '*',
                component: data.component || '*'
            };
            if (!query.root_org && !query.framework) {
                onRecordFound = this.cassandra.instance.form_data.findOneAsync(Object.assign({}, query, { root_org: "*", framework: "*" }));
            }
            else if (query.root_org && !query.framework) {
                onRecordFound = this.cassandra.instance.form_data.findOneAsync(Object.assign({}, query, { framework: "*" }));
            }
            else {
                onRecordFound = this.cassandra.instance.form_data.findOneAsync(query);
            }
            yield onRecordFound.then((data) => __awaiter(this, void 0, void 0, function* () {
                if (!data) {
                    // find record by specified rootOrgId with framework = '*'
                    yield this.cassandra.instance.form_data.findOneAsync(Object.assign({}, query, { framework: "*" }));
                }
                else {
                    return data;
                }
            }))
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                if (!data) {
                    // get the default data
                    return yield this.cassandra.instance.form_data.findOneAsync(Object.assign({}, query, { root_org: "*", framework: "*" }));
                }
                else {
                    return data;
                }
            }))
                .then(data => {
                if (!data) {
                    data = {};
                }
                else {
                    data = data.toJSON();
                }
                if (data && typeof data.data === "string")
                    data.data = JSON.parse(data.data);
                data.rootOrgId = data.root_org;
                data.subType = data.subtype;
                data = _.omit(data, ['root_org', 'subtype', 'last_modified', 'created']);
                res.status(200)
                    .send(new models_2.FormResponse(undefined, {
                    id: 'api.form.read',
                    data: {
                        form: data
                    }
                }));
            })
                .catch(error => {
                res.status(500)
                    .send(new models_2.FormResponse({
                    id: "api.form.read",
                    err: "ERR_READ_FORM_DATA",
                    errmsg: JSON.stringify(error)
                }));
            });
        });
    }
}
exports.Server = Server;
