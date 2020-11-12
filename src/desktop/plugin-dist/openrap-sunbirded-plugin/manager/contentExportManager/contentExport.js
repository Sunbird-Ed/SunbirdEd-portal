var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
const os = require("os");
const path = require("path");
const fse = require("fs-extra");
const manifest_1 = require("../../manifest");
const uuid = require("uuid");
const api_1 = require("OpenRAP/dist/api");
const logger_1 = require("@project-sunbird/logger");
const fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id);
// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
class ExportContent {
    constructor(destFolder, dbParentNode, dbChildNodes) {
        this.destFolder = destFolder;
        this.dbParentNode = dbParentNode;
        this.dbChildNodes = dbChildNodes;
        this.contentBaseFolder = fileSDK.getAbsPath("content");
        this.corruptContents = [];
        this.startTime = Date.now();
        this.settingSDK = api_1.containerAPI.getSettingSDKInstance(manifest_1.manifest.id);
    }
    export(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cb = cb;
            try {
                this.parentArchive = fileSDK.archiver();
                this.ecarName = this.dbParentNode.name
                    ? this.dbParentNode.name.replace(/[&\/\\#,+()$~%.!@%|"":*?<>{}]/g, "") : "Untitled content";
                logger_1.logger.info("Export content mimeType", this.dbParentNode.mimeType);
                yield this.getContentBaseFolder(this.dbParentNode.identifier);
                if (this.dbParentNode.mimeType === "application/vnd.ekstep.content-collection") {
                    this.parentManifest = yield fileSDK.readJSON(path.join(this.contentBaseFolder, this.dbParentNode.identifier, "manifest.json"));
                    this.dbParentNode = _.get(this.parentManifest, "archive.items[0]");
                    const response = yield this.loadParentCollection();
                    if (!response) {
                        throw new Error("COLLECTION_FILE_MISSING");
                    }
                }
                else {
                    this.dbParentNode.visibility = "Default";
                    const response = yield this.loadContent(this.dbParentNode, false);
                    if (!response) {
                        throw new Error("CONTENT_FILE_MISSING");
                    }
                }
                // this.interval = setInterval(() => logger.info(this.parentArchive.pointer(),
                // this.parentArchive._entriesCount, this.parentArchive._entriesProcessedCount), 1000);
                const data = yield this.streamZip();
                logger_1.logger.info("Ecar exported successfully with", data);
                this.cb(null, data);
            }
            catch (error) {
                this.cb(error, null);
                logger_1.logger.error("Error while exporting content", this.ecarName, error, this.corruptContents);
            }
        });
    }
    loadParentCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentState = yield this.validContent(this.dbParentNode);
            if (!contentState.valid) {
                this.corruptContents.push({ id: this.dbParentNode.identifier, reason: contentState.reason });
                return false;
            }
            if (this.dbParentNode.appIcon) {
                const appIconFileName = path.basename(this.dbParentNode.appIcon);
                const appIcon = path.join(this.contentBaseFolder, this.dbParentNode.identifier, appIconFileName);
                if (path.dirname(this.dbParentNode.appIcon) !== ".") {
                    this.archiveAppend("createDir", null, path.dirname(this.dbParentNode.appIcon));
                }
                this.archiveAppend("path", appIcon, this.dbParentNode.appIcon);
            }
            this.parentManifest.archive.items = _.map(this.parentManifest.archive.items, (item) => {
                if (item.mimeType !== "application/vnd.ekstep.content-collection") {
                    const dbContentRef = _.find(this.dbChildNodes, { identifier: item.identifier });
                    return dbContentRef ? dbContentRef : item;
                }
                return item;
            });
            this.archiveAppend("buffer", Buffer.from(JSON.stringify(this.parentManifest)), "manifest.json");
            const exist = yield fse.pathExists(path.join(this.contentBaseFolder, this.dbParentNode.identifier, "hierarchy.json"));
            if (exist) {
                this.archiveAppend("path", path.join(this.contentBaseFolder, this.dbParentNode.identifier, "hierarchy.json"), "hierarchy.json");
            }
            yield this.loadChildNodes();
            return true;
        });
    }
    loadChildNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbParentNode.childNodes || !this.dbParentNode.childNodes.length) {
                return true;
            }
            const childNodes = _.filter(_.get(this.parentManifest, "archive.items"), (item) => (item.mimeType !== "application/vnd.ekstep.content-collection")).map((item) => item.identifier);
            for (const child of childNodes) {
                const dbChildDetails = _.find(this.dbChildNodes, { identifier: child });
                const childManifest = yield fileSDK.readJSON(path.join(this.contentBaseFolder, child, "manifest.json"))
                    .catch((err) => logger_1.logger.error(`Error while reading content: ${child} for content import for ${this.dbParentNode.identifier}`));
                if (childManifest) {
                    const childDetails = _.get(childManifest, "archive.items[0]");
                    if (childDetails) {
                        yield this.loadContent(childDetails, true);
                    }
                }
                else if (dbChildDetails) {
                    yield this.loadContent(dbChildDetails, true);
                }
                else {
                    this.corruptContents.push({ id: child, reason: "CONTENT_MISSING" });
                }
            }
            return true;
        });
    }
    loadContent(contentDetails, child) {
        return __awaiter(this, void 0, void 0, function* () {
            delete contentDetails._rev;
            delete contentDetails._id;
            const contentState = yield this.validContent(contentDetails);
            if (!contentState.valid) {
                this.corruptContents.push({ id: contentDetails.identifier, reason: contentState.reason });
                return false;
            }
            const baseDestPath = child ? contentDetails.identifier + "/" : "";
            if (child) {
                this.archiveAppend("createDir", null, contentDetails.identifier);
            }
            this.archiveAppend('buffer', this.getManifestBuffer(contentDetails), baseDestPath + 'manifest.json');
            if (contentDetails.appIcon) {
                if (path.dirname(contentDetails.appIcon) !== ".") {
                    this.archiveAppend("createDir", null, baseDestPath + path.dirname(contentDetails.appIcon));
                }
                const appIconFileName = path.basename(contentDetails.appIcon);
                const appIcon = path.join(this.contentBaseFolder, contentDetails.identifier, appIconFileName);
                this.archiveAppend("path", appIcon, baseDestPath + contentDetails.appIcon);
            }
            if (!contentDetails.artifactUrl || (contentDetails.artifactUrl && contentDetails.contentDisposition === "online")) {
                return true; // exit for online content or artifactUrl is not present
            }
            if (path.dirname(contentDetails.artifactUrl) !== ".") {
                this.archiveAppend("createDir", null, baseDestPath + path.dirname(contentDetails.artifactUrl));
            }
            if (path.extname(contentDetails.artifactUrl) && path.extname(contentDetails.artifactUrl) !== ".zip") {
                const artifactUrlName = path.basename(contentDetails.artifactUrl);
                const artifactUrlPath = path.join(this.contentBaseFolder, contentDetails.identifier, artifactUrlName);
                this.archiveAppend("path", artifactUrlPath, baseDestPath + contentDetails.artifactUrl);
            }
            else if (path.extname(contentDetails.artifactUrl) && path.extname(contentDetails.artifactUrl) === ".zip") {
                yield this.loadZipContent(contentDetails, child);
            }
            return true;
        });
    }
    validContent(contentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield fse.pathExists(path.join(this.contentBaseFolder, contentDetails.identifier));
            if (!exist) {
                return { valid: false, reason: "CONTENT_FOLDER_MISSING" };
            }
            if (contentDetails.appIcon) {
                const appIconFileName = path.basename(contentDetails.appIcon);
                const appIcon = path.join(this.contentBaseFolder, contentDetails.identifier, appIconFileName);
                const appIconExist = yield fse.pathExists(appIcon);
                if (!appIconExist) {
                    return { valid: false, reason: "APP_ICON_MISSING" };
                }
            }
            if (!contentDetails.artifactUrl || contentDetails.contentDisposition === "online") {
                return { valid: true };
            }
            if (path.extname(contentDetails.artifactUrl) !== ".zip") {
                const artifactUrlName = path.basename(contentDetails.artifactUrl);
                const artifactUrlPath = path.join(this.contentBaseFolder, contentDetails.identifier, artifactUrlName);
                const artifactExist = yield fse.pathExists(artifactUrlPath);
                if (!artifactExist) {
                    return { valid: false, reason: "ARTIFACT_MISSING" };
                }
            }
            else {
                let hasZipEntry = yield this.readDirectory(path.join(this.contentBaseFolder, contentDetails.identifier));
                hasZipEntry = _.remove(hasZipEntry, (entry) => !(_.endsWith(entry, ".zip")));
                hasZipEntry = _.filter(hasZipEntry, (entry) => {
                    if ((contentDetails.appIcon && contentDetails.appIcon.includes(entry))
                        || entry === "manifest.json") {
                        return false;
                    }
                    return true;
                });
                if (!hasZipEntry.length) {
                    return { valid: false, reason: "ZIP_ARTIFACT_MISSING" };
                }
            }
            return { valid: true };
        });
    }
    loadZipContent(contentDetails, child) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseDestPath = child ? contentDetails.identifier + "/" : "";
            const childArchive = fileSDK.archiver();
            let toBeZipped = yield this.readDirectory(path.join(this.contentBaseFolder, contentDetails.identifier));
            toBeZipped = _.remove(toBeZipped, (entry) => !(_.endsWith(entry, ".zip")));
            for (const items of toBeZipped) {
                if ((!contentDetails.appIcon || !contentDetails.appIcon.includes(items)) && items !== "manifest.json") {
                    if (path.extname(items)) {
                        childArchive.append(fs.createReadStream(path.join(this.contentBaseFolder, contentDetails.identifier, items)), { name: items });
                    }
                    else {
                        childArchive.directory(path.join(this.contentBaseFolder, contentDetails.identifier, items), items);
                    }
                }
            }
            childArchive.finalize();
            this.archiveAppend("stream", childArchive, baseDestPath + contentDetails.artifactUrl);
        });
    }
    streamZip() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const ecarFilePath = path.join(this.destFolder, this.ecarName + ".ecar");
                const output = fs.createWriteStream(ecarFilePath);
                output.on("close", () => resolve({
                    ecarSize: this.parentArchive.pointer(),
                    timeTaken: (Date.now() - this.startTime) / 1000,
                    skippedContent: this.corruptContents,
                    name: this.ecarName,
                    ecarFilePath,
                }));
                output.on("end", () => logger_1.logger.info("Content has been zipped"));
                this.parentArchive.on("error", reject);
                this.parentArchive.finalize();
                this.parentArchive.pipe(output);
            });
        });
    }
    archiveAppend(type, src, dest) {
        if (type === "path") {
            this.parentArchive.append(fs.createReadStream(src), { name: dest });
        }
        else if (type === "directory") {
            this.parentArchive.directory(src, dest);
        }
        else if (type === "stream") {
            this.parentArchive.append(src, { name: dest });
        }
        else if (type === "createDir") {
            dest = dest.endsWith("/") ? dest : dest + "/";
            this.parentArchive.append(null, { name: dest });
        }
        else if (type === "buffer") {
            this.parentArchive.append(src, { name: dest });
        }
    }
    readDirectory(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => fs.readdir(filePath, (err, items) => err ? reject(err) : resolve(items)));
        });
    }
    getManifestBuffer(manifestJson) {
        const manifestData = {
            id: "content.archive",
            ver: manifestJson.pkgVersion || "1.0",
            ts: new Date(),
            params: { resmsgid: uuid() },
            archive: {
                count: _.get(manifestJson, "archive.items.length") || 1,
                ttl: 24,
                items: [manifestJson],
            },
        };
        return Buffer.from(JSON.stringify(manifestData));
    }
    getContentBaseFolder(contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (os.platform() === "win32") {
                try {
                    const locationList = yield this.settingSDK.get(`content_storage_location`);
                    let i = 0;
                    while (_.get(locationList, "location.length") && i < locationList.location.length) {
                        const item = path.join(locationList.location[i], "content");
                        const folderPath = path.join(item, contentId);
                        if (yield fileSDK.isDirectoryExists(folderPath)) {
                            this.contentBaseFolder = item;
                            break;
                        }
                        i++;
                    }
                }
                catch (error) {
                    logger_1.logger.error("Error while exporting content", error);
                }
            }
        });
    }
}
exports.ExportContent = ExportContent;
