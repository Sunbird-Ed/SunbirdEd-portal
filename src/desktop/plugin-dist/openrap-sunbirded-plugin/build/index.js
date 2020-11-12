var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fse = require("fs-extra");
const path = require("path");
const config_1 = require("./config");
const filesPath = path.join(__dirname, "..", "..", "data");
const baseUrl = config_1.default.baseUrl;
const init = () => __awaiter(this, void 0, void 0, function* () {
    yield fse.ensureDir(filesPath);
    yield getResourceBundles();
    // await getOrgs()
    // await getChannel()
    // await frameworks()
    // await getForms()
});
const getOrgs = () => __awaiter(this, void 0, void 0, function* () {
    for (const id of config_1.default.organizations.ids) {
        const result = yield axios_1.default.post(baseUrl + config_1.default.organizations.url, { request: { filters: { slug: id, isRootOrg: true } } });
        yield fse.ensureFile(path.join(filesPath, config_1.default.organizations.dest_folder, id + ".json"));
        yield fse.writeJson(path.join(filesPath, config_1.default.organizations.dest_folder, id + ".json"), result.data);
    }
});
const getChannel = () => __awaiter(this, void 0, void 0, function* () {
    for (const id of config_1.default.channels.ids) {
        const result = yield axios_1.default.get(baseUrl + config_1.default.channels.url + id);
        yield fse.ensureFile(path.join(filesPath, config_1.default.channels.dest_folder, id + ".json"));
        yield fse.writeJson(path.join(filesPath, config_1.default.channels.dest_folder, id + ".json"), result.data);
    }
});
const getResourceBundles = () => __awaiter(this, void 0, void 0, function* () {
    for (const bundle of config_1.default.resourceBundles.files) {
        const result = yield axios_1.default.get(baseUrl + config_1.default.resourceBundles.url + bundle);
        yield fse.ensureFile(path.join(filesPath, config_1.default.resourceBundles.dest_folder, bundle + ".json"));
        yield fse.writeJson(path.join(filesPath, config_1.default.resourceBundles.dest_folder, bundle + ".json"), result.data);
    }
});
const frameworks = () => __awaiter(this, void 0, void 0, function* () {
    for (const id of config_1.default.frameworks.ids) {
        const result = yield axios_1.default.get(baseUrl + config_1.default.frameworks.url + id);
        yield fse.ensureFile(path.join(filesPath, config_1.default.frameworks.dest_folder, id + ".json"));
        yield fse.writeJson(path.join(filesPath, config_1.default.frameworks.dest_folder, id + ".json"), result.data);
    }
});
const getForms = () => __awaiter(this, void 0, void 0, function* () {
    for (const data of config_1.default.forms.requests_data) {
        const requestData = {
            request: data,
        };
        const result = yield axios_1.default.post(baseUrl + config_1.default.forms.url, requestData);
        const filename = `${data.type}_${data.subType}_${data.action}_${data.rootOrgId}`;
        yield fse.ensureFile(path.join(filesPath, config_1.default.forms.dest_folder, filename + ".json"));
        yield fse.writeJson(path.join(filesPath, config_1.default.forms.dest_folder, filename + ".json"), result.data);
    }
});
init()
    .catch((err) => {
    // tslint:disable-next-line:no-console
    console.log("Error while preparing data", err);
});
