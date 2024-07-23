import * as  _ from "lodash";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as fse from "fs-extra";
import { manifest } from "../../manifest";
import {v1 as uuid} from "uuid";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { logger } from "@project-sunbird/logger";
const fileSDK = containerAPI.getFileSDKInstance(manifest.id);
import ContentLocation from "../../controllers/contentLocation";
import { Inject } from 'typescript-ioc';
export class ExportContent {
  private contentBaseFolder;
  private parentArchive;
  private parentManifest;
  private ecarName;
  private corruptContents = [];
  private startTime = Date.now();
  private cb;
  private settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
  @Inject private standardLog = containerAPI.getStandardLoggerInstance();
  constructor(private destFolder, private dbParentNode, private dbChildNodes) { }
  public async export(cb) {
    const contentLocation = new ContentLocation(manifest.id);
    this.contentBaseFolder = await contentLocation.get();
    this.cb = cb;
    try {
      this.parentArchive = fileSDK.archiver();
      this.ecarName = this.dbParentNode.name
      ? this.dbParentNode.name.replace(/[&\/\\#,+()$~%.!@%|"":*?<>{}]/g, "") : "Untitled content";
      logger.info("Export content mimeType", this.dbParentNode.mimeType);
      await this.getContentBaseFolder(this.dbParentNode.identifier);
      if (this.dbParentNode.mimeType === "application/vnd.ekstep.content-collection") {
        this.parentManifest = await fileSDK.readJSON(path.join(this.contentBaseFolder, this.dbParentNode.identifier, "manifest.json"));
        this.dbParentNode = _.get(this.parentManifest, "archive.items[0]");
        const response = await this.loadParentCollection();
        if(!response){
          throw new Error("COLLECTION_FILE_MISSING");
        }
      } else {
        this.dbParentNode.visibility = "Default";
        const response  = await this.loadContent(this.dbParentNode, false);
        if(!response){
          throw new Error("CONTENT_FILE_MISSING");
        }
      }
      // this.interval = setInterval(() => logger.info(this.parentArchive.pointer(),
      // this.parentArchive._entriesCount, this.parentArchive._entriesProcessedCount), 1000);
      const data = await this.streamZip();
      logger.info("Ecar exported successfully with", data);
      this.cb(null, data);
    } catch (error) {
      this.standardLog.error({ id: 'CONTENT_EXPORT_FAILED', message: `Error while exporting content, ${this.ecarName}, ${this.corruptContents}`, error });
      this.cb(error, null);
    }
  }
  private async loadParentCollection(): Promise<boolean> {
    const contentState = await this.validContent(this.dbParentNode);
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
        const dbContentRef = _.find(this.dbChildNodes, {identifier: item.identifier});
        return dbContentRef ? dbContentRef : item;
      }
      return item;
    });
    this.archiveAppend("buffer", Buffer.from(JSON.stringify(this.parentManifest)), "manifest.json");
    const exist = await fse.pathExists(path.join(this.contentBaseFolder,
      this.dbParentNode.identifier, "hierarchy.json"));
    if (exist) {
      this.archiveAppend("path", path.join(this.contentBaseFolder, this.dbParentNode.identifier, "hierarchy.json"), "hierarchy.json");
    }
    await this.loadChildNodes();
    return true;
  }
  private async loadChildNodes(): Promise<boolean> {
    if (!this.dbParentNode.childNodes || !this.dbParentNode.childNodes.length) {
      return true;
    }
    const childNodes = _.filter(_.get(this.parentManifest, "archive.items"),
      (item) => (item.mimeType !== "application/vnd.ekstep.content-collection")).map((item) => item.identifier);
    for (const child of childNodes) {
      const dbChildDetails = _.find(this.dbChildNodes, { identifier: child });
      const childManifest = await fileSDK.readJSON(path.join(this.contentBaseFolder, child, "manifest.json"))
        .catch((err) => this.standardLog.error({ id: 'CONTENT_EXPORT_CONTENT_READ_FAILED', message: `Error while reading content: ${child} for content import for ${this.dbParentNode.identifier}`, error: err }));
      if (childManifest) {
        const childDetails = _.get(childManifest, "archive.items[0]");
        if (childDetails) {
          await this.loadContent(childDetails, true);
        }
      } else if (dbChildDetails) {
        await this.loadContent(dbChildDetails, true);
      } else {
        this.corruptContents.push({ id: child, reason: "CONTENT_MISSING" });
      }
    }
    return true;
  }
  private async loadContent(contentDetails, child): Promise<boolean> {
    delete contentDetails._rev;
    delete contentDetails._id;
    const contentState = await this.validContent(contentDetails);
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
    } else if (path.extname(contentDetails.artifactUrl) && path.extname(contentDetails.artifactUrl) === ".zip") {
      await this.loadZipContent(contentDetails, child);
    }
    return true;
  }
  private async validContent(contentDetails) {
    const exist = await fse.pathExists(path.join(this.contentBaseFolder, contentDetails.identifier));
    if (!exist) {
      return { valid: false, reason: "CONTENT_FOLDER_MISSING" };
    }
    if (contentDetails.appIcon) {
      const appIconFileName = path.basename(contentDetails.appIcon);
      const appIcon = path.join(this.contentBaseFolder, contentDetails.identifier, appIconFileName);
      const appIconExist = await fse.pathExists(appIcon);
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
      const artifactExist = await fse.pathExists(artifactUrlPath);
      if (!artifactExist) {
        return { valid: false, reason: "ARTIFACT_MISSING" };
      }
    } else {
      let hasZipEntry: any = await this.readDirectory(path.join(this.contentBaseFolder, contentDetails.identifier));
      hasZipEntry = _.remove(hasZipEntry, (entry: any) =>  !(_.endsWith(entry, ".zip")));
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
  }
  private async loadZipContent(contentDetails, child) {
    const baseDestPath = child ? contentDetails.identifier + "/" : "";
    const childArchive = fileSDK.archiver();
    let toBeZipped: any = await this.readDirectory(path.join(this.contentBaseFolder, contentDetails.identifier));
    toBeZipped = _.remove(toBeZipped, (entry: any) =>  !(_.endsWith(entry, ".zip")));
    for (const items of toBeZipped) {
      if ((!contentDetails.appIcon || !contentDetails.appIcon.includes(items)) && items !== "manifest.json") {
        if (path.extname(items)) {
          childArchive.append(fs.createReadStream(path.join(this.contentBaseFolder,
            contentDetails.identifier, items)), { name: items });
        } else {
          childArchive.directory(path.join(this.contentBaseFolder, contentDetails.identifier, items), items);
        }
      }
    }
    childArchive.finalize();
    this.archiveAppend("stream", childArchive, baseDestPath + contentDetails.artifactUrl);
  }
  private async streamZip() {
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
      output.on("end", () => logger.info("Content has been zipped"));
      this.parentArchive.on("error", reject);
      this.parentArchive.finalize();
      this.parentArchive.pipe(output);
    });
  }
  private archiveAppend(type, src, dest) {
    if (type === "path") {
      this.parentArchive.append(fs.createReadStream(src), { name: dest });
    } else if (type === "directory") {
      this.parentArchive.directory(src, dest);
    } else if (type === "stream") {
      this.parentArchive.append(src, { name: dest });
    } else if (type === "createDir") {
      dest = dest.endsWith("/") ? dest : dest + "/";
      this.parentArchive.append(null, { name: dest });
    } else if (type === "buffer") {
      this.parentArchive.append(src, { name: dest });
    }
  }
  private async readDirectory(filePath) {
    return new Promise((resolve, reject) =>
      fs.readdir(filePath, (err, items) => err ? reject(err) : resolve(items)));
  }
  private getManifestBuffer(manifestJson) {
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

  private async getContentBaseFolder(contentId: string) {

    if (os.platform() === "win32") {
      try {
        const locationList: any = await this.settingSDK.get(`content_storage_location`);
        let i = 0;
        while (_.get(locationList, "location.length") && i < locationList.location.length) {
          const item = path.join(locationList.location[i], "content");
          const folderPath = path.join(item, contentId);
          if (await fileSDK.isDirectoryExists(folderPath)) {
            this.contentBaseFolder = item;
            break;
          }
          i++;
        }
      } catch (error) {
        this.standardLog.error({ id: 'CONTENT_EXPORT_FAILED', message: `Error while exporting content`, error });
      }
    }
  }
}
