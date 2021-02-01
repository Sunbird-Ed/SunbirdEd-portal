import { app, BrowserWindow, dialog, crashReporter, shell } from "electron";
import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";
import  { Server }   from './modules/server'
import { LoginSessionProvider } from './helper/login-session-provider'
const startTime = Date.now();
let envs: any = {};
const getFilesPath = () => {
  return app.isPackaged
    ? path.join(app.getPath("userData"), "." + envs["APP_NAME"])
    : __dirname;
};
// set the env
const initializeEnv = () => {
  let rootOrgId, hashTagId;
  if(app.isPackaged) {
    envs = JSON.parse(Buffer.from("ENV_STRING_TO_REPLACE", 'base64').toString('ascii')) // deployment step will replace the base64 string 
    rootOrgId = "ROOT_ORG_ID";
    hashTagId = "HASH_TAG_ID";
  } else {
    envs = JSON.parse(
      fs.readFileSync(path.join(__dirname, "env.json"), { encoding: "utf-8" })
    );
    let rootOrgObj = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          'openrap-sunbirded-plugin',
          "data",
          "organizations",
          `${envs["CHANNEL"]}.json`
        ),
        { encoding: "utf-8" }
      )
    );
    
    rootOrgId = _.get(rootOrgObj, "result.response.content[0].rootOrgId");
    hashTagId = _.get(rootOrgObj, "result.response.content[0].hashTagId");
  }
  process.env.ROOT_ORG_ID = rootOrgId || hashTagId;
  process.env.ROOT_ORG_HASH_TAG_ID = hashTagId;
  process.env.TELEMETRY_VALIDATION = app.isPackaged ? "false" : "true";
  process.env.IS_PACKAGED_APP = String(app.isPackaged);
  process.env.APP_VERSION = app.getVersion();
  _.forEach(envs, (value, key) => {
    process.env[key] = value;
  });
  process.env.DATABASE_PATH = path.join(getFilesPath(), "database");
  process.env.FILES_PATH = getFilesPath();
  if (!fs.existsSync(process.env.DATABASE_PATH)) {
    fse.ensureDirSync(process.env.DATABASE_PATH);
  }
};
initializeEnv();
import { containerAPI } from "@project-sunbird/OpenRAP/api/index";
import { logger,logLevels, enableLogger } from '@project-sunbird/logger';
import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";
import express from "express";
import portscanner from "portscanner";
import * as bodyParser from "body-parser";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as os from "os";
const windowIcon = path.join(__dirname, "build", "icons", "png", "512x512.png");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: any;
let loginWindow: any;
let appBaseUrl;
let deviceId: string;
const expressApp = express();
expressApp.use(bodyParser.json());
let fileSDK = containerAPI.getFileSDKInstance("");
let systemSDK = containerAPI.getSystemSDKInstance();
let deviceSDK = containerAPI.getDeviceSdkInstance();
deviceSDK.initialize({key: envs.APP_BASE_URL_TOKEN});
const reloadUIOnFileChange = () => {
  const subject = new Subject<any>();
  subject.pipe(debounceTime(2500)).subscribe(data => {
    let currentURL = win.webContents.getURL();
    console.log(
      "portal file changed- reloading screen with current url",
      currentURL
    );
    if(fs.existsSync(path.join("public", "portal", "index.html"))) {
      fs.rename(
        path.join("public", "portal", "index.html"),
        path.join("public", "portal", "index.ejs"),
        err => {
          if (err) console.log("ERROR: " + err);
          win.reload();
        }
      );
    }
  });
  fileSDK
    .watch([path.join("public", "portal")])
    .on("add", path => subject.next(path))
    .on("change", path => subject.next(path))
    .on("unlink", path => subject.next(path));
};
expressApp.use("/dialog/content/import", async (req, res) => {
  const filePaths = await importContent();
  res.send({ message: "SUCCESS", responseCode: "OK", filePaths });
});
expressApp.use("/dialog/telemetry/import", async (req, res) => {
  const filePaths = await importTelemetryFiles();
  res.send({ message: "SUCCESS", responseCode: "OK", filePaths });
});
const importTelemetryFiles = async () => {
  const {filePaths} = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Custom File Type", extensions: ["zip"] }]
  });
  if (filePaths) {
    makeTelemetryImportApiCall(filePaths);
  }
  return filePaths;
};
const makeTelemetryImportApiCall = async (telemetryFiles: Array<string>) => {
  if(_.isEmpty(telemetryFiles)){
    logger.error('Telemetry import api call error', 'Reason: makeTelemetryImportApiCall called with empty array');
    return;
  }
  await HTTPService.post(`${appBaseUrl}/api/telemetry/v1/import`, telemetryFiles)
    .toPromise()
    .then(data => {
      win.webContents.executeJavaScript(`
        var event = new Event("telemetry:import", {bubbles: true});
        document.dispatchEvent(event);
      `);
      logger.info("Telemetry import started successfully", telemetryFiles);
    })
    .catch(error =>
      logger.error(
        "Telemetry import failed with",
        _.get(error, 'response.data') || error.message,
        "for ",
        telemetryFiles
      )
    );
};
const importContent = async () => {
  const {filePaths} = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Custom File Type", extensions: ["ecar"] }]
  });
  if (filePaths) {
    makeImportApiCall(filePaths);
  }
  return filePaths;
};
expressApp.use("/dialog/content/export", async (req, res) => {
  let destFolder = await showFileExplorer();
  if (destFolder && destFolder[0]) {
    res.send({
      message: "SUCCESS",
      responseCode: "OK",
      destFolder: destFolder[0]
    });
  } else {
    res
      .status(400)
      .send({
        message: "Ecar dest folder not selected",
        responseCode: "NO_DEST_FOLDER"
      });
  }
});
expressApp.use("/dialog/telemetry/export", async (req, res) => {
  let destFolder = await showFileExplorer();
  if (destFolder && destFolder[0]) {
    fse.access(destFolder[0], fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        logger.error("Folder does not have write permission", err);
        res.status(500).send({ message: "Folder does not have write permission", responseCode: "OPERATION_NOT_PERMITTED" });
      } else {
        res.send({
          message: "SUCCESS",
          responseCode: "OK",
          destFolder: destFolder[0]
        });
      }
    });
  } else {
    res
      .status(400)
      .send({
        message: "Ecar dest folder not selected",
        responseCode: "NO_DEST_FOLDER"
      });
  }
});

expressApp.use("/dialog/content/suggestLocation", async (req, res) => {
  let destFolder = await showFileExplorer();
  if (destFolder && destFolder[0]) {
    res.send({
      message: "SUCCESS",
      responseCode: "OK",
      destFolder: destFolder[0]
    });
  } else {
    res
      .status(400)
      .send({
        message: "Dest folder not selected",
        responseCode: "NO_DEST_FOLDER"
      });
  }
});

expressApp.use("/dialog/login", async (req, res) => {
  const options = {"request":{"type":"desktopConfig","action":"get","subType":"login"}};
  HTTPService.post(`${appBaseUrl}/api/data/v1/form/read`, options).toPromise().then(async response => {
    let loginFormConfig = _.find(response.data.result.form.data.fields, (field) => field.context == 'login');
    const loginPageOptions = {
      parentWindow: win, 
      loginFormCoing: loginFormConfig,
      appbaseUrl: appBaseUrl,
      deviceId: deviceId
    }
    const loginSessionProvider = new LoginSessionProvider(loginPageOptions);
    loginSessionProvider.childLoginWindow().then((rs) =>{
      res.send({ message: "SUCCESS", responseCode: "OK" })
    })
  }, err => {
    res.status(400).send({ message: "Login failed", responseCode: "LOGIN_FAILED"})
  })
  
});


const showFileExplorer = async () => {
  const {filePaths} = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"]
  });
  return filePaths;
};
// Crash reporter
const startCrashReporter = async () => {
  let apiKey = await deviceSDK.getToken(deviceId);
  crashReporter.start({
    productName: process.env.APP_NAME,
    companyName: process.env.APP_NAME,
    submitURL: `${process.env.APP_BASE_URL}/api/desktop/v1/upload-crash-logs?eHVyhwSdt=${apiKey}&deviceId=${deviceId}`,
    uploadToServer: true
  });
}
const setDeviceId = async () => {
  deviceId = await systemSDK.getDeviceId();
}
const copyPluginsMetaData = async () => {
  if (app.isPackaged) {
        await fse.copy(
          path.join(__dirname, 'openrap-sunbirded-plugin'),
          path.join(getFilesPath(), 'openrap-sunbirded-plugin')
        );
  }
};
const setAvailablePort = async () => {
  process.env.APPLICATION_PORT = await portscanner.findAPortNotInUse(9000, 9100);
};
// start the express app to load in the main window
const startApp = async () => {
  return new Promise((resolve, reject) => {
    new Server(expressApp)
    expressApp.listen(process.env.APPLICATION_PORT, () => {
        logger.info("app is started on port " + process.env.APPLICATION_PORT);
        resolve();
      })
    });
};

const waitForDBToLoad = () => {
  return (new Promise((resolve, reject) => {
    EventManager.subscribe("openrap-sunbirded-plugin:initialized", resolve)
  }))
}
// start loading all the dependencies
const bootstrapDependencies = async () => {
  console.log("============> bootstrap started");
  await startCrashReporter().catch(error => logger.error("unable to start crash reporter", error));
  await copyPluginsMetaData();
  console.log("============> copy plugin done");
  await setAvailablePort();
  console.log("============> set avail port");
  await containerAPI.bootstrap();
  console.log("============> containerAPI bootstrap done");
  await startApp();
  await waitForDBToLoad();
  console.log("============> App startup done");
  //to handle the unexpected navigation to unknown route
  //  expressApp.all("*", (req, res) => res.redirect("/"));
};
async function initLogger() {
  await setDeviceId();
  let logLevel: logLevels = 'error';
  if(!app.isPackaged){
    logLevel = 'debug';
  }
  process.env.LOG_LEVEL = logLevel;
  enableLogger({
    logBasePath: path.join(getFilesPath(), 'logs'),
    logLevel: logLevel,
    context: {src: 'desktop', did: deviceId, appVersion: app.getVersion()},
    adopterConfig: {
      adopter: 'winston'
    }
  });
}

const onMainWindowCrashed = async (err) => {
    logger.error('App got crashed', err)
    let telemetryInstance = containerAPI
      .getTelemetrySDKInstance()
      .getInstance();
      telemetryInstance.error({
        context: {
          env: 'home'
        },
        edata : {
        err: 'APP_MAIN_WINDOW_CRASHED',
        errtype: 'DESKTOPAPP',
        stacktrace: err.toString()
      }
    })
    let userResponse = await dialog.showMessageBox(
        {
          title: 'App is crashed',
          message: 'App is crashed, please click on button to Restart or close the app',
          defaultId: 0,
          cancelId: 1,
          buttons: ['Restart', 'Close']
        }
      );
    if(userResponse.response === 0) {
        app.relaunch();
        app.quit()
    } else if (userResponse.response === 1) {
        app.quit()
    }
};

async function createWindow() {
  await initLogger();
  console.log('=================> initLogger env done', process.env.DATABASE_PATH);
  //splash screen
  let splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: windowIcon,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false
    },
  });
  splash.once("show", () => {
    console.log('==========> splash screen shown env done', process.env.DATABASE_PATH);
    let telemetryInstance = containerAPI
      .getTelemetrySDKInstance()
      .getInstance();
      console.log('==========> telemetry init');
    telemetryInstance.impression({
      context: {
        env: "home"
      },
      edata: {
        type: "view",
        pageid: "splash",
        uri: "loading/index.html",
        duration: (Date.now() - startTime) / 1000
      }
    });
    // Create the main window.
    win = new BrowserWindow({
      titleBarStyle: "hidden",
      show: false,
      minWidth: 700,
      minHeight: 500,
      webPreferences: {
        nodeIntegration: false,
        enableRemoteModule: false,
        nativeWindowOpen: true
      },
      icon: windowIcon
    });
    if(app.isPackaged){
      win.removeMenu();
    }
    if (!app.isPackaged) {
      reloadUIOnFileChange();
    }
      win.webContents.on('new-window', async(event, url, frameName, disposition, options, additionalFeatures) => {
        event.preventDefault();
        try {
          if (!['https:', 'http:'].includes(new URL(url).protocol)) return;
          await shell.openExternal(url);
        } catch(error) {
          logger.error("Error while opening link",error);
        }
      })
    
    win.webContents.once("dom-ready", () => {
    let perfLogger = containerAPI.getPerfLoggerInstance();
    const startUpDuration = (Date.now() - startTime) / 1000  
    if(startUpDuration > 10) {
      logger.error(`App took ${startUpDuration} sec to start`);
    } else {
      logger.info(`App took ${startUpDuration} sec to start`);
    }
    perfLogger.log({
      type: 'APP_STARTUP',
      time: startUpDuration,
      metaData: {}
    });
      telemetryInstance.start({
        context: {
          env: "home"
        },
        edata: {
          type: "app",
          duration: startUpDuration
        }
      });
      splash.destroy();
      win.show();
      win.maximize();
      EventManager.emit("app:initialized", {})
      win.webContents.on('crashed', onMainWindowCrashed)
      win.webContents.on('console-message', (event, level, message, line, sourceId) => {
        const levelMap = new Map([[0, 'debug'],[1, 'info'],[2, 'warn'], [3, 'error']])
        logger[levelMap.get(level)](message, sourceId, line);
      });
    });
    // create admin for the database
    bootstrapDependencies()
      .then(() => {
        console.log('=============> bootstrapDependencies done', process.env.DATABASE_PATH);
        appBaseUrl = `http://localhost:${process.env.APPLICATION_PORT}`;
        win.loadURL(appBaseUrl);
        win.focus();
        checkForOpenFile();
        // Open the DevTools.
        // win.webContents.openDevTools();
      })
      .catch(err => {
        logger.error("unable to start the app ", err);
      });
    // Emitted when the window is closed.
    win.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
    });
  });
  splash.loadFile(path.join(__dirname, "loading", "index.html"));
  splash.show();
  
}
let gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    logger.info(
      `trying to open second-instance of the app ${JSON.stringify(commandLine)}`
    );
    // if the OS is windows file open call will come here when app is already open
    let interval = setInterval(() => {
      if (appBaseUrl) {
        checkForOpenFile(commandLine);
        clearInterval(interval);
      }
    }, 1000);
    // if user open's second instance, we should focus our window
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
// below code is to handle the ecar file open event from different os's
// to handle ecar file open in MAC OS
app.on("open-file", (e, path) => {
  e.preventDefault();
  logger.info(`trying to open content with path ${path}`);
  checkForOpenFile([path]);
});
const makeImportApiCall = async (contents: Array<string>) => {
  if(_.isEmpty(contents)){
    logger.error('Content import api call error', 'Reason: makeImportApiCall called with empty array');
    return;
  }
  await HTTPService.post(`${appBaseUrl}/api/content/v1/import`, contents)
    .toPromise()
    .then(data => {
      win.webContents.executeJavaScript(`
        var event = new Event("content:import", {bubbles: true});
        document.dispatchEvent(event);
      `);
      logger.info("Content import started successfully", contents);
    })
    .catch(error =>
      logger.error(
        "Content import failed with",
        _.get(error, 'response.data') || error.message,
        "for contents",
        contents
      )
    );
};
// to handle ecar file open in windows and linux
const checkForOpenFile = (files?: string[]) => {
  let contents = files || process.argv;
  const openFileContents = [];
  if (
    (os.platform() === "win32" || os.platform() === "linux") &&
    !_.isEmpty(contents)
  ) {
    _.forEach(contents, file => {
      if (_.endsWith(_.toLower(file), ".ecar")) {
        openFileContents.push(file);
      }
    });
    if (appBaseUrl) {
      makeImportApiCall(openFileContents);
    }
    logger.info(
      `Got request to open the  ecars : ${JSON.stringify(openFileContents)}`
    );
  }
};

process
  .on("unhandledRejection", (reason, p) => {
    logger.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", err => {
    logger.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });