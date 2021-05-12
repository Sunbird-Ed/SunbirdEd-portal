import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as cheerio from "cheerio";
import * as _ from "lodash";
import * as path from "path";
import * as inline from "web-resource-inliner";
import DesktopAppUpdate from "./../controllers/appUpdate";
import ContentLocation from "./../controllers/contentLocation";
import User from "./../controllers/user";
import { manifest } from "./../manifest";
import Response from "./../utils/response";
const proxy = require('express-http-proxy');

export default (app, proxyURL) => {

    const ticketSDK = containerAPI.getTicketSdkInstance();
    const standardLog = containerAPI.getStandardLoggerInstance();
    app.post("/api/help/v1/report/issue", async (req, res) => {
        ticketSDK.createTicket(req.body).then((successRes) => {
            res.send(Response.success("api.report.issue", successRes, req));
        }).catch(({status, message, code}) => {
            standardLog.error({ id: 'DESKTOP_REPORT_ISSUE_FAILED', message: 'Received error while reporting a issue', mid: req.headers["X-msgid"], error: message });
            res.status(status || 500).send(Response.error("api.report.issue", status, message, code));
        });
    });

    const desktopAppUpdate = new DesktopAppUpdate(manifest);
    app.get("/api/desktop/v1/update",
        desktopAppUpdate.getDesktopAppUpdate.bind(desktopAppUpdate),
    );

    app.get("/api/app/v1/info",
        desktopAppUpdate.getAppInfo.bind(desktopAppUpdate),
    );

    app.get("/api/desktop/v1/system-info", async (req, res) => {
        try {
            const contentLocation = new ContentLocation(manifest.id);
            const contentBasePath = await contentLocation.get();
            const systemInfo: any = await containerAPI
                .getSystemSDKInstance(manifest.id)
                .getDeviceInfo();
            systemInfo.contentBasePath = contentBasePath;
            return res.send(Response.success("api.desktop.system-info", systemInfo, req));
        } catch (err) {
            standardLog.error({ id: 'DESKTOP_SYSTEMINFO_PROCESS_FAILED', message: 'Received error while processing desktop app systemInfo request', mid: req.headers["X-msgid"], error: err });
            res.status(500);
            return res.send(Response.error("api.desktop.system-info", 500));
        }
    });

    app.post("/api/desktop/v1/change-content-location", async (req, res) => {
        try {
            const contentPath = _.get(req.body, "request.path");
            const contentLocation = new ContentLocation(manifest.id);
            const status = contentLocation.set(app, path.join(contentPath));
            if (status) {
                return res.send(Response.success("api.desktop.change-content-location", status, req));
            } else {
                res.status(500);
                return res.send(Response.error("api.desktop.change-content-location", 500));
            }
        } catch (err) {
            standardLog.error({ id: 'DESKTOP_CHANGE_CONTENT_LOCATION_FAILED', message: 'Received error while changing content location', mid: req.headers["X-msgid"], error: err });
            res.status(500);
            return res.send(Response.error("api.desktop.change-content-location", 500));
        }
    });

    const user = new User(manifest);
    app.post("/api/desktop/user/v1/create",
        user.create.bind(user),
    );

    app.get("/api/desktop/user/v1/read",
        user.read.bind(user),
    );
    app.post(
        "/api/desktop/user/v1/update", user.update.bind(user),
    );


    app.get("/api/app/v1/terms_of_use", proxy(`${proxyURL}`, {
        proxyReqPathResolver() {
            return `/term-of-use.html`;
        }, userResDecorator(proxyRes, proxyResData) {
            return new Promise(function (resolve) {
                const proxyData = proxyResData.toString();
                inline.html({
                    fileContent: proxyData,
                    strict: false,
                    relativeTo: process.env.APP_BASE_URL,
                }, function (err, result) {
                    const $ = cheerio.load(result);
                    $(`#header`).replaceWith(`<header id="header" style="display:none"></header>`);
                    $(`#footer`).replaceWith(`<footer id="footer" style="display:none"></footer>`);
                    $("#terms-of-use").removeClass("header-gap");
                    resolve($.html());
                });
            });
        },
    }));
}