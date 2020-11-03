import { Observer } from "rxjs";
import { ITaskExecuter, ISystemQueue } from "OpenRAP/dist/api";
export declare class ContentDownloader implements ITaskExecuter {
    static taskType: string;
    static group: string;
    private contentDownloadData;
    private databaseSdk;
    private telemetryHelper;
    private downloadSDK;
    private observer;
    private fileSDK;
    private systemSDK;
    private contentDownloadMetaData;
    private ecarBasePath;
    private interrupt;
    private interruptType;
    private downloadFailedCount;
    private extractionFailedCount;
    private downloadContentCount;
    private contentLocation;
    start(contentDownloadData: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean>;
    status(): ISystemQueue;
    pause(): Promise<true | {
        code: string;
        status: number;
        message: string;
    }>;
    resume(contentDownloadData: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean>;
    cancel(): Promise<true | {
        code: string;
        status: number;
        message: string;
    }>;
    retry(contentDownloadData: ISystemQueue, observer: Observer<ISystemQueue>): Promise<boolean>;
    private getDownloadObserver;
    private handleDownloadError;
    private handleDownloadProgress;
    private handleDownloadComplete;
    private extractZipEntry;
    private extractContent;
    private saveContentToDb;
    private checkForAllTaskCompletion;
    private constructShareEvent;
    private deleteRemovedContent;
    private checkSpaceAvailability;
    private loadZipHandler;
    private createHierarchy;
}
