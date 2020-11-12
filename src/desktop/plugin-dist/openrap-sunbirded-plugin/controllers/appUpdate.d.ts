import { Manifest } from "@project-sunbird/ext-framework-server/models";
export default class Appupdate {
    private deviceId;
    constructor(manifest: Manifest);
    getDeviceId(manifest: any): Promise<void>;
    getDesktopAppUpdate(req: any, res: any): Promise<any>;
    getAppInfo(req: any, res: any): Promise<any>;
    private checkForUpdate;
}
