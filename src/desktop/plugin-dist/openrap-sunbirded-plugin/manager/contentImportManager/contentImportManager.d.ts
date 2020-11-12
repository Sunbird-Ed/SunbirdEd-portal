export declare class ContentImportManager {
    private dbSDK;
    private telemetryHelper;
    private systemQueue;
    initialize(): Promise<void>;
    add(ecarPaths: string[]): Promise<string[]>;
    pauseImport(importId: string): Promise<any>;
    resumeImport(importId: string): Promise<any>;
    cancelImport(importId: string): Promise<any>;
    retryImport(importId: string): Promise<any>;
    private getEcarSize;
    private getUnregisteredEcars;
    private findPath;
}
