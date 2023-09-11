/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */
import * as fse from "fs-extra";
import * as fs from "fs";
import * as path from "path";
import DecompressZip from "decompress-zip";
import * as _ from "lodash";
import * as chokidar from "chokidar";
const archiver = require("archiver");
import { ClassLogger } from '@project-sunbird/logger/decorator';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
}) */
/**
 * This SDK provides methods to handle file deleting , folder creation and deletion prefixed with pluginId
 *
 */
export default class FileSDK {
  private pluginId: string;
  private prefixPath: string;

  constructor(pluginId: string, customPath?: string) {
    this.pluginId = pluginId;
    let fileBasePath =
      process.env.FILES_PATH || path.join(__dirname, "..", "..", "..", "..");
    this.prefixPath = customPath ? customPath : path.join(fileBasePath, this.pluginId);
  }

  /**
   * @param foldersPath
   * This method creates the folders it adds the plugin id as prefix so that conflicts with folder path
   * with other plugins are resolved
   * @returns Promise
   */
  mkdir(foldersPath: string) {
    return fse.ensureDir(path.join(this.prefixPath, foldersPath));
  }

  /**
   * @param sourcePath
   * @param destPath
   * This method copy data from sourcePath to destPath
   * @returns Promise
   */
  copy(sourcePath: string, destPath: string) {
    let isAbsoluteSourcePath = path.isAbsolute(sourcePath);
    if (!isAbsoluteSourcePath) {
      sourcePath = this.getAbsPath(sourcePath);
    }

    let isAbsoluteDestPath = path.isAbsolute(destPath);
    if (!isAbsoluteDestPath) {
      destPath = this.getAbsPath(destPath);
    }

    return fse.copy(sourcePath, destPath);
  }

  move(source: string, destination: string) {
    return fse.move(
      path.join(this.prefixPath, source),
      path.join(this.prefixPath, destination),
      { overwrite: true }
    );
  }

  /**
   *
   * @param filePath
   * This method deletes the file it adds the plugin id as prefix so that conflicts with file path
   * with other plugins are resolved it tries to find file from current directory to delete it
   * @returns Promise
   */
  remove(file: string) {
    return fse.remove(path.join(this.prefixPath, file));
  }

  archiver(){
    return archiver('zip');
  }

  zip(Path: string, destPath: string, fileName: string) {
    return new Promise<void>((resolve, reject) => {
      let output = fs.createWriteStream(
        path.join(this.prefixPath, destPath, fileName)
      );
      let archive = archiver("zip");

      output.on("finish", () => {
        resolve();
      });

      archive.on("warning", err => {
        if (err.code === "ENOENT") {
          // log warning
        } else {
          reject(err);
        }
      });

      archive.on("error", err => {
        reject(err);
      });
      archive.pipe(output);

      let file = path.join(this.prefixPath, Path);
      fs.lstat(file, (error, stats) => {
        if (error) {
          reject(error);
        } else {
          if (stats.isFile()) {
            let file = path.join(this.prefixPath, Path);
            archive.append(fs.createReadStream(file), {
              name: path.basename(Path)
            });
          } else {
            archive.directory(path.join(this.prefixPath, Path), false);
          }
          //here we consider that if Path is having extension then append as stream otherwise add the folders to archiver.

          archive.finalize();
        }
      });
    });
  }

  /**
   * @param filePath
   * @param  destPath
   *  @param extractToFolder // If this flag is true contents will be extracted to folder
   * which is create using source file name,
   * if it is false it is extracted to dest folder with out creating folder with file name
   *
   * This method will unzip the file to dest folder
   * @returns Promise
   */
  unzip(filePath: string, destPath: string, extractToFolder: boolean) {
    //This is folder name taken from source filename and contents will be extracted to this folder name
    let destFolderName = path.join(this.prefixPath, destPath);
    let srcFilePath = path.join(this.prefixPath, filePath);

    if (extractToFolder) {
      destFolderName = path.join(
        destFolderName,
        path.basename(filePath, path.extname(filePath))
      );
    }

    return new Promise((resolve, reject) => {
      let unzipper = new DecompressZip(srcFilePath);
      unzipper.on("error", (err: any) => {
        reject(err.message);
      });

      unzipper.on("extract", () => {
        resolve(path.join(destFolderName));
      });

      unzipper.extract({
        path: destFolderName
      });
    });
  }

  readJSON(filePath: string) {
    return fse.readJson(filePath);
  }

  getAbsPath(Path: string) {
    return path.join(this.prefixPath, Path);
  }

  watch(paths: string[]) {
    return chokidar.watch(paths);
  }

  readdir(dirPath: string) {
    if(path.isAbsolute(dirPath)) {
      return fse.readdir(dirPath);
    } else {
      return fse.readdir(this.getAbsPath(dirPath));
    }
  }

  isDirectoryExists(dirPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.stat(dirPath, (error, stats) => {
        if (error) {
          reject(error);
        }
        resolve(stats.isDirectory());
      });
    });
  };
}
