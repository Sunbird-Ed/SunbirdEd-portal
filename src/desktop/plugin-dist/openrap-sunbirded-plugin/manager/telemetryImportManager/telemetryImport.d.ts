import { ISystemQueue, ITaskExecuter } from "OpenRAP/dist/api";
import { Observer } from "rxjs";
export declare class ImportTelemetry implements ITaskExecuter {
    static taskType: string;
    private deviceId;
    private workerProcessRef;
    private telemetryHelper;
    private interrupt;
    private telemetryImportData;
    private observer;
    private networkQueue;
    private progress;
    private skippedFiles;
    constructor();
    getDeviceId(): Promise<void>;
    status(): ISystemQueue;
    start(telemetryImportData: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean>;
    private parseFile;
    private saveDataFromWorker;
    private saveToDB;
    private updateProgress;
    private handleChildProcessMessage;
    private handleWorkerCloseEvents;
    private handleUnexpectedChildProcessExit;
    private handleChildProcessError;
    private constructShareEvent;
}
