import { app, BrowserWindow, dialog, session } from "electron";
import * as qs from 'qs';
import * as _ from "lodash";
import * as path from "path";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
const windowIcon = path.join(__dirname, "build", "icons", "png", "512x512.png");
import { logger } from '@project-sunbird/logger';

export class LoginSessionProvider {
    private extras: {[key: string]: string} = {};
    private captured: {[key: string]: string} = {};
    private mainWindow;
    private loginConfig;
    private loginWindow;
    private appBaseUrl;
    private redirectURI;
    private deviceId;

    constructor(options: { parentWindow: any; loginFormCoing: any; appbaseUrl: string; deviceId: string; }) { 
        this.mainWindow = options.parentWindow;
        this.loginConfig = options.loginFormCoing;
        this.appBaseUrl = options.appbaseUrl;
        this.deviceId = options.deviceId;
    }

    public buildUrl(host: string, path: string, params: { [p: string]: string }) {
        return `${host}${path}?${qs.stringify(params)}`;
    }

    protected buildGoogleTargetUrl(captured: {[key: string]: string}, extras: {[key: string]: string}): URL {
        const url = new URL(captured['googleRedirectUrl']);

        delete extras['redirect_uri'];
        url.searchParams.set('redirect_uri', this.redirectURI);
        delete extras['error_callback'];
        url.searchParams.set('error_callback', this.redirectURI);

        Object.keys(extras).forEach(key => url.searchParams.set(key, extras[key]));

        return url;
    }

    async childLoginWindow() {
        logger.debug(`Opening login window`);
        let params = this.loginConfig.target.params.reduce((acc, p) => {
            if(p.key === 'redirect_uri') {
                this.redirectURI = p.value;
            }
            acc[p.key] = p.value;
            return acc;
        }, {})
        const pdata = {
            id: process.env.APP_ID,
            ver: process.env.APP_VERSION,
            pid: "desktop.app"
        }
        params.pdata = JSON.stringify(pdata);
        params.did = this.deviceId;
        const loginURL = this.buildUrl(this.loginConfig.target.host, this.loginConfig.target.path, params);
        if(!this.loginWindow) {
            this.loginWindow = new BrowserWindow({ 
                parent: this.mainWindow, 
                closable: true, 
                titleBarStyle: "hidden",
                show: false,
                minWidth: 700,
                minHeight: 500,
                minimizable: false,
                maximizable: false,
                backgroundColor: "#EDF4F9",
                webPreferences: {
                    nodeIntegration: false,
                    enableRemoteModule: false,
                    session: session.fromPartition('loginwindow')
                },
            });
            this.loginWindow.maximize();
            this.loginWindow.show();
            if(app.isPackaged){
                this.loginWindow.removeMenu();
            }
        }
        this.loginWindow.loadURL(loginURL, {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Electron/8.5.5 Safari/537.36"
        }).then(() => {
            logger.debug(`Login window loaded successfully`);
            _.forEach(this.loginConfig.return, (forCase) => {
                switch (forCase.type) {
                    case 'password':
                        this.buildPasswordSessionProvider(forCase);
                        break;
                    case 'state':
                        this.buildStateSessionProvider(forCase);
                        break;
                    case 'google':
                        this.buildGoogleSessionProvider(forCase)
                        break;
                    case 'state-error': 
                        this.capture({
                            host: forCase.when.host,
                            path: forCase.when.path,
                            params: forCase.when.params
                        }).then(() => {
                            let error_message = '';
                            if(this.captured['error_message']) {
                                error_message = this.captured['error_message'];
                            }
                            this.closeLoginWindow(false, error_message);
                        }); 
                        break;
                    case 'reset': 
                        this.buildResetPasswordProvider(forCase)
                        break;
                }
            })
        });
    }

    showLoader() {
        this.loginWindow.loadURL(`file://${path.join(__dirname, "..", "loading", "loader.html")}`);
    }

    protected buildPasswordSessionProvider(forCase) {
        this.capture({
            host: forCase.when.host,
            path: forCase.when.path,
            params: forCase.when.params
        }).then(async () =>
            await this.success()
        ).then(async (captured) => {
            this.showLoader();
            logger.debug(`Resolve access token from buildPasswordSessionProvider`);
            const userData = await this.resolvePasswordSession(captured);
            if(userData) {
                await this.getUsers(userData);
            }
        });
    }

    protected buildStateSessionProvider(forCase) {
        this.capture({
            host: forCase.when.host,
            path: forCase.when.path,
            params: forCase.when.params
        }).then(async () =>
            await this.success()
        ).then(async (captured) => {
            this.showLoader();
            logger.debug(`Resolve access token from buildStateSessionProvider`);
            const userData = await this.resolveStateSession(captured);
            if(userData) {
                await this.getUsers(userData);
            }
        });
    }

    protected buildResetPasswordProvider(forCase) {
        this.capture({
            host: forCase.when.host,
            path: forCase.when.path,
            params: [
                ...forCase.when.params,
                {
                    key: 'client_id',
                    resolveTo: 'client_id',
                    match: 'portal'
                },
                {
                    key: 'automerge',
                    resolveTo: 'automerge',
                    exists: 'false'
                }
            ]
        }).then(() => {
            this.showLoader();
            logger.debug(`Reload login winload after reset password success`);
            this.childLoginWindow();
        }); 
    }

    protected buildGoogleSessionProvider(forCase) {
        return this.capture({
            host: forCase.when.host,
            path: forCase.when.path,
            params: forCase.when.params
        }).then(async () =>
            this.success()
        ).then((captured) =>
            this.getCaptureExtras().then((extras) => {
                this.showLoader();
                logger.debug(`Resolve redirect url from buildGoogleSessionProvider`);
                const url = `${captured.googleRedirectUrl}?${qs.stringify(extras)}`;
                this.loginWindow.loadURL(url, {
                    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Electron/8.5.5 Safari/537.36"
                }).then(() =>{
                    this.capture({
                        host: forCase.when.host,
                        path: forCase.when.path,
                        params: [{
                                "key": "access_token",
                                "resolveTo": "access_token"
                            }, {
                                "key": "refresh_token",
                                "resolveTo": "refresh_token"
                            }]
                    }).then(async () =>
                        this.success()
                    ).then(async (captured) => {
                        this.showLoader();
                        logger.debug(`Resolve access token from buildGoogleSessionProvider`);
                        const userData = {
                            access_token: captured.access_token,
                            refresh_token: captured.refresh_token
                        };
                        if(userData) {
                            await this.getUsers(userData);
                        }
                    }).catch(err => { 
                        this.showLoader();
                    })
                });
            })
        );
    }

    capture({host, path, params}: { host: string; path: string; params: { key: string; resolveTo: string, match?: string, exists?: 'true' | 'false' }[] }): Promise<void> {

        const isHostMatching = (url: URL) => url.origin === host;
        const isPathMatching = (url: URL) => url.pathname === path;
        const areParamsMatching = (url: URL) => params.map(p => p).every(param => {
            if (param.exists === 'false') {
                return !url.searchParams.has(param.key);
            } else {
                if (param.match) {
                    return url.searchParams.has(param.key) && url.searchParams.get(param.key) === param.match;
                }

                return url.searchParams.has(param.key);
            }
        });

        return new Promise((resolve) => {
            const onLoadStart = (eventUrl) => {
                if (eventUrl) {
                    const url = new URL(eventUrl);

                    if (
                        isHostMatching(url) &&
                        isPathMatching(url) &&
                        areParamsMatching(url)
                    ) {
                        this.captured = {
                            ...this.captured,
                            ...params.reduce<{ [key: string]: string }>((acc, p) => {
                                acc[p.resolveTo] = url.searchParams.get(p.key)!;
                                return acc;
                            }, {}),
                        };

                        this.extras = {};
                        params.map(p => p.key).forEach(param => url.searchParams.delete(param));
                        url.searchParams['forEach']((value, key) => {
                           this.extras[key] = value;
                        });

                        resolve();
                    }
                }
            };

            this.loginWindow.webContents.on('did-navigate', (event, url) => {
                onLoadStart(url);
            });
        });
    }

    async closeLoginWindow(loginStatus: boolean, error_message?: string) {
        logger.debug(`closing login window with login status ${loginStatus}`);
        await this.loginWindow.webContents.session.clearStorageData();
        this.loginWindow.close();
        this.captured = {};
        this.loginWindow = null;
        if(loginStatus) {
            this.mainWindow.reload();
        } else {
            let msg = error_message || 'Server error while login, Please try again later'
            logger.error(msg);
            dialog.showErrorBox('Login error', msg);
        }
    }

    async success(): Promise<{ [p: string]: string }> {
        return {...this.captured};
    }

    async fail(): Promise<{ [p: string]: string }> {
        throw {...this.captured};
    }

    async getCaptureExtras(): Promise<{ [p: string]: string }> {
        return {...this.extras};
    }

    private async resolvePasswordSession(captured: {[key: string]: string}) {
        const reqBody = qs.stringify({
            redirect_uri: process.env.APP_BASE_URL + '/oauth2callback',
            code: captured['code'],
            grant_type: 'authorization_code',
            client_id: 'desktop'
        });
        const appConfig = {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        };
        return await HTTPService.post(`${process.env.APP_BASE_URL}/${this.loginConfig.target.authUrl}/token`, reqBody, appConfig)
            .toPromise()
            .then(async (response: any) => {
                if (response.data.access_token && response.data.refresh_token) {
                    return {
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token
                    };
                }
            }).catch((err) => {
                logger.error(`Error while resolvePasswordSession : ${err.message}`, err);
                this.closeLoginWindow(false);
            });
    }

    private async resolveStateSession(captured: {[key: string]: string}) {
        return await HTTPService.get(`${process.env.APP_BASE_URL}/v1/sso/create/session?id=${captured['id']}&clientId=desktop`, {})
            .toPromise()
            .then(async (response: any) => {
                if (response.data.access_token && response.data.refresh_token) {
                    return {
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token
                    };
                }
            }).catch((err) => {
                logger.error(`Error while resolveStateSession : ${err.message}`, err);
                this.closeLoginWindow(false);
            });
    }

    private async getUsers(userTokens) {
        const reqBody = userTokens;
        const appConfig = {
            headers: {
                "content-type": "application/json",
            },
        };
        return await HTTPService.post(`${this.appBaseUrl}/api/user/v1/startSession`, reqBody, appConfig)
            .toPromise()
            .then(async (response: any) => {
                if (response) {
                    this.closeLoginWindow(true);
                }
            }).catch((err) => {
                logger.error(`Error while getUsers after resolving user token : ${err.message}`, err);
                this.closeLoginWindow(false);
            });
    }
}
