export declare class LogSyncManager {
    private deviceId;
    private networkQueue;
    private settingSDK;
    private workerProcessRef;
    private isInProgress;
    constructor();
    start(): Promise<void>;
    private checkPreviousLogSync;
    private launchChildProcess;
    private handleChildProcessMessage;
    private syncLogsToServer;
    private buildRequestBody;
    private killChildProcess;
    private handleChildProcessError;
    private updateLastSyncDate;
    private isLessThanToday;
    private getDeviceId;
}
