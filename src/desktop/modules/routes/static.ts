import * as _ from "lodash";
const express = require("express");
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { manifest } from "./../manifest";
import * as path from "path";
import { logger } from "@project-sunbird/logger";

export default (app, contentFilesPath, ecarsFolderPath ) => {
    const fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    app.set("view engine", "ejs");
    app.use("/contentPlayer/preview/content",express.static(fileSDK.getAbsPath(contentFilesPath)));
    app.use( "/contentPlayer/preview", express.static(fileSDK.getAbsPath(contentFilesPath)));
    app.use("/contentPlayer/preview/content/*/content-plugins", express.static(fileSDK.getAbsPath(contentFilesPath)));
    app.use("/contentPlayer/preview", express.static(path.join(__dirname, "..", "..", "public", "contentPlayer", "preview")));
    app.use(express.static(path.join(__dirname, "..", "..", "public", "contentPlayer", "preview")));
    app.use("/content", express.static(fileSDK.getAbsPath(contentFilesPath)));
    app.use(express.static(fileSDK.getAbsPath(contentFilesPath)));
    app.use( "/ecars", express.static(fileSDK.getAbsPath(ecarsFolderPath)));
    app.use(express.static(fileSDK.getAbsPath(ecarsFolderPath)));
    app.use("/sunbird-plugins", express.static(path.join(__dirname, "..", "..", "public", "sunbird-plugins")));
    app.use(express.static(path.join(__dirname, "..", "..", "public", "sunbird-plugins")));
    app.all(
        [
          "/",
          "/mydownloads",
          "mydownloads/*",
          "/explore",
          "/explore/*",
          "/play/*",
          "/import/content",
          "/get",
          "/get/*",
          "/browse",
          "/browse/*",
          "/search/*",
          "/help-center",
          "/help-center/*",
          "/profile",
          "/profile/*",
        ],
        async (req, res) => {
            const locals = await getLocals(manifest);
            _.forIn(locals, (value, key) => {
              res.locals[key] = value;
            });
            res.render(
              path.join(__dirname, "..", "..", "public", "portal", "index.ejs"),
            );
        },
      );
      app.use(express.static(path.join(__dirname, "..", "..", "public", "portal")));
    }

  const getLocals = async (manifest) => {
    const deviceId = await containerAPI
      .getSystemSDKInstance(manifest.id)
      .getDeviceId();
    const userSDK = containerAPI.getUserSdkInstance();
    const loggedInUserSession: any = await userSDK.getUserSession().catch(error => { logger.debug("User not logged in", error);})
    const locals: any = {};

    if (loggedInUserSession) {
      locals.userId = loggedInUserSession.userId;
      locals.sessionId = loggedInUserSession.userId;  
    } else {
      locals.userId = null;
      locals.sessionId = null;
    }
    locals.cdnUrl = "";
    locals.theme = "";
    locals.defaultPortalLanguage = "en";
    locals.instance = process.env.APP_NAME;
    locals.appId = process.env.APP_ID;
    locals.defaultTenant = process.env.CHANNEL || "sunbird";
    locals.exploreButtonVisibility = "true";
    locals.helpLinkVisibility = null;
    locals.defaultTenantIndexStatus = null;
    locals.extContWhitelistedDomains = null;
    locals.buildNumber = process.env.APP_VERSION;
    locals.apiCacheTtl = "300";
    locals.cloudStorageUrls = null;
    locals.userUploadRefLink = null;
    locals.googleCaptchaSiteKey = null;
    locals.videoMaxSize = null;
    locals.reportsLocation = null;
    locals.deviceRegisterApi = "/api/v1/device/registry/";
    locals.playerCdnEnabled = "";
    locals.previewCdnUrl = "";
    locals.cdnWorking = null;
    locals.offlineDesktopAppTenant = "";
    locals.offlineDesktopAppVersion = "";
    locals.offlineDesktopAppReleaseDate = "";
    locals.offlineDesktopAppSupportedLanguage = "";
    locals.offlineDesktopAppDownloadUrl = "";
    locals.logFingerprintDetails = "";
    locals.deviceId = deviceId;
    locals.deviceProfileApi = "/api/v3/device/profile";
    locals.deviceApi = `${process.env.APP_BASE_URL}/api/`;
    locals.baseUrl = process.env.APP_BASE_URL;

    locals.slug = null;
    locals.userSid = null;
    locals.slugForProminentFilter = null;
    locals.collectionEditorURL = null;
    locals.contentEditorURL = null;
    locals.genericEditorURL = null;
    locals.botConfigured = null;
    locals.botServiceURL = null;
    locals.superAdminSlug = null;
    locals.p1reCaptchaEnabled = null;
    locals.p2reCaptchaEnabled = null;
    locals.p3reCaptchaEnabled = null;
    locals.enableSSO = null;
    locals.reportsListVersion = null;
    return locals;
  }