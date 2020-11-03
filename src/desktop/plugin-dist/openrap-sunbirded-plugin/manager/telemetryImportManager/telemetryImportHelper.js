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
const StreamZip = require("node-stream-zip");
const ITelemetryImport_1 = require("./ITelemetryImport");
let zipHandler;
let zipEntries;
let telemetryImportData;
const parseFile = () => __awaiter(this, void 0, void 0, function* () {
    try {
        zipHandler = yield loadZipHandler(telemetryImportData.metaData.sourcePath);
        zipEntries = zipHandler.entries();
        const manifestEntry = zipEntries["manifest.json"] || zipEntries["/manifest.json"];
        ;
        if (!manifestEntry) {
            throw ITelemetryImport_1.getErrorObj({ message: "manifest.json is missing in the zip" }, "MANIFEST_MISSING");
        }
        let manifestData = yield getFileData(manifestEntry);
        manifestData = manifestData.toString();
        manifestData = JSON.parse(manifestData);
        if (_.get(manifestData, "archive.items")) {
            for (const items of _.get(manifestData, "archive.items")) {
                yield streamItems(items);
            }
        }
        else {
            sendMessage("TELEMETRY_IMPORT_ERROR", ITelemetryImport_1.getErrorObj("NO_DATA_TO_IMPORT", "UNHANDLED_PARSE_FILE_ERROR"));
        }
        // Sending complete after all items are imported
        process.send({ message: "COMPLETE" });
    }
    catch (err) {
        sendMessage("TELEMETRY_IMPORT_ERROR", ITelemetryImport_1.getErrorObj(err, "UNHANDLED_PARSE_FILE_ERROR"));
    }
    finally {
        if (zipHandler.close) {
            zipHandler.close();
        }
    }
});
const loadZipHandler = (filePath) => __awaiter(this, void 0, void 0, function* () {
    const zip = new StreamZip({ file: filePath, storeEntries: true, skipEntryNameValidation: true });
    return new Promise((resolve, reject) => {
        zip.on("ready", () => resolve(zip));
        zip.on("error", reject);
    });
});
const getFileData = (data) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        zipHandler.stream(data.name, (err, stm) => {
            const streamData = [];
            stm.on("data", (chunk) => {
                streamData.push(chunk);
            });
            stm.on("end", () => {
                resolve(Buffer.concat(streamData));
            });
            stm.on("error", reject);
        });
    });
});
const streamItems = (item) => __awaiter(this, void 0, void 0, function* () {
    const gzEntry = zipEntries[item.file] || zipEntries["/" + item.file];
    const telePacketData = yield getFileData(gzEntry);
    const dbData = Object.assign({}, item, { requestBody: telePacketData });
    process.send({ message: "SAVE_TO_DB", dbData });
});
const sendMessage = (message, err) => {
    const messageObj = {
        message, telemetryImportData,
    };
    if (err) {
        messageObj.err = err;
    }
    process.send(messageObj);
};
process.on("message", (data) => {
    telemetryImportData = data.telemetryImportData;
    if (data.message === "PARSE_FILE") {
        parseFile();
    }
    else if (data.message === "KILL") {
        sendMessage("DATA_SYNC_KILL");
    }
});
