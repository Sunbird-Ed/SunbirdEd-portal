import { ISystemQueue, ITaskExecuter } from "OpenRAP/dist/api";
export declare class ContentDeleteHelper implements ITaskExecuter {
    static taskType: string;
    concurrency: number;
    queue: any[];
    running: number;
    private contentDeleteData;
    private observer;
    private systemQueue;
    private fileSDK;
    private settingSDK;
    private prefixPath;
    start(contentDeleteData: ISystemQueue, observer: import("rxjs").Observer<ISystemQueue>): Promise<boolean>;
    status(): ISystemQueue;
    pushToQueue(filePath: any): Promise<void>;
    private next;
    private checkPath;
}
