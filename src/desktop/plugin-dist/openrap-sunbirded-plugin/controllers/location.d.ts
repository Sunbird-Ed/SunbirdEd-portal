import { Manifest } from "@project-sunbird/ext-framework-server/models";
export declare class Location {
    private databaseSdk;
    private telemetryHelper;
    private fileSDK;
    private settingSDK;
    constructor(manifest: Manifest);
    insert(): Promise<void>;
    search(req: any, res: any): Promise<any>;
    proxyToAPI(req: any, res: any, next: any): Promise<any>;
    insertStatesDataInDB(onlineStates: any, msgId: any): Promise<void>;
    updateStateDataInDB(district: any, msgId: any): Promise<void>;
    saveLocation(req: any, res: any): Promise<any>;
    get(req: any, res: any): Promise<any>;
    private constructSearchEdata;
}
