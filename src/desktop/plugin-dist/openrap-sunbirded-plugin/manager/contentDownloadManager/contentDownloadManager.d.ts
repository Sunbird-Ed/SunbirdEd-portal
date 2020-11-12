export declare class ContentDownloadManager {
    private dbSDK;
    private systemQueue;
    private systemSDK;
    initialize(): Promise<void>;
    update(req: any, res: any): Promise<any>;
    download(req: any, res: any): Promise<any>;
    pause(req: any, res: any): Promise<any>;
    resume(req: any, res: any): Promise<any>;
    cancel(req: any, res: any): Promise<any>;
    retry(req: any, res: any): Promise<any>;
    private getContentChildNodeDetailsFromApi;
    private getContentChildNodeDetailsFromDb;
    private checkDiskSpaceAvailability;
    private getAddedAndUpdatedContents;
    private getDeletedContents;
}
