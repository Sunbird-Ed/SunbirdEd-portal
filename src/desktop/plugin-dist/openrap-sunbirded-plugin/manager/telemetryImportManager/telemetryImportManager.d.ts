export declare class TelemetryImportManager {
    private systemQueue;
    initialize(): Promise<void>;
    add(paths: string[]): Promise<string[]>;
    retryImport(importId: string): Promise<any>;
    private getFileSize;
    private getUnregisteredPaths;
    private findPath;
}
