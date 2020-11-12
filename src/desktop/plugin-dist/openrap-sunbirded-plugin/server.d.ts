import { Manifest, BaseServer } from "@project-sunbird/ext-framework-server/models";
export declare class Server extends BaseServer {
    private sunbirded_plugin_initialized;
    private ecarsFolderPath;
    private contentFilesPath;
    private databaseSdk;
    private fileSDK;
    private contentDelete;
    private logSyncManager;
    private settingSDK;
    private perfLogger;
    constructor(manifest: Manifest);
    handleSystemQueueTaskCompletionEvents(): void;
    private addPerfLogForDelete;
    private addPerfLogForImportAndDownload;
    initialize(manifest: Manifest): Promise<void>;
    private syncLogs;
    private insertConfig;
}
