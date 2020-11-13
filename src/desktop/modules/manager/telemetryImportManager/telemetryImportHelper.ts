import * as  _ from "lodash";
import * as  StreamZip from "node-stream-zip";
import { ISystemQueue } from "OpenRAP/dist/api";
import { ErrorObj, getErrorObj } from "./ITelemetryImport";

let zipHandler;
let zipEntries;
let telemetryImportData: ISystemQueue;

const parseFile = async () => {
  try {
    zipHandler = await loadZipHandler(telemetryImportData.metaData.sourcePath);
    zipEntries = zipHandler.entries();
    const manifestEntry = zipEntries["manifest.json"] || zipEntries["/manifest.json"];;
    if (!manifestEntry) {
      throw getErrorObj({ message: "manifest.json is missing in the zip" }, "MANIFEST_MISSING");
    }
    let manifestData: any = await getFileData(manifestEntry);
    manifestData = manifestData.toString();
    manifestData = JSON.parse(manifestData);
    if (_.get(manifestData, "archive.items")) {
      for (const items of _.get(manifestData, "archive.items")) {
        await streamItems(items);
      }
    } else {
      sendMessage("TELEMETRY_IMPORT_ERROR", getErrorObj("NO_DATA_TO_IMPORT", "UNHANDLED_PARSE_FILE_ERROR"));
    }
    // Sending complete after all items are imported
    process.send({ message: "COMPLETE" });
  } catch (err) {
    sendMessage("TELEMETRY_IMPORT_ERROR", getErrorObj(err, "UNHANDLED_PARSE_FILE_ERROR"));
  } finally {
    if (zipHandler.close) {
      zipHandler.close();
    }
  }
};
const loadZipHandler = async (filePath) => {
  const zip = new StreamZip({ file: filePath, storeEntries: true, skipEntryNameValidation: true });
  return new Promise((resolve, reject) => {
    zip.on("ready", () => resolve(zip));
    zip.on("error", reject);
  });
};

const getFileData = async (data) => {
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
};

const streamItems = async (item) => {
  const gzEntry = zipEntries[item.file] || zipEntries["/" + item.file] ;
  const telePacketData = await getFileData(gzEntry);
  const dbData = {
    ...item, requestBody: telePacketData,
  };
  process.send({ message: "SAVE_TO_DB", dbData });
};

const sendMessage = (message: string, err?: ErrorObj) => {
  const messageObj: any = {
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
  } else if (data.message === "KILL") {
    sendMessage("DATA_SYNC_KILL");
  }
});
