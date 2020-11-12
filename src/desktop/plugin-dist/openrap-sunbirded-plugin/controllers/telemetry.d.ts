import { Manifest } from "@project-sunbird/ext-framework-server/models";
export default class Telemetry {
    private databaseSdk;
    private telemetrySDK;
    private systemQueue;
    private networkQueue;
    private telemetryImportManager;
    constructor(manifest: Manifest);
    addEvents(req: any, res: any): any;
    getInfo(req: any, res: any): void;
    getTelemetrySyncSetting(req: any, res: any): Promise<any>;
    setTelemetrySyncSetting(req: any, res: any): Promise<any>;
    sync(req: any, res: any): Promise<any>;
    export(req: any, res: any): void;
    import(req: any, res: any): Promise<any>;
    retryImport(req: any, res: any): Promise<void>;
    list(req: any, res: any): Promise<any>;
}
