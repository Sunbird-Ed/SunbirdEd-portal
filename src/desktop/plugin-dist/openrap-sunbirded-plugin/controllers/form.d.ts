import { Manifest } from "@project-sunbird/ext-framework-server/models";
export declare class Form {
    private databaseSdk;
    private fileSDK;
    constructor(manifest: Manifest);
    insert(): Promise<void>;
    search(req: any, res: any): void;
}
