import { Manifest } from "@project-sunbird/ext-framework-server/models/Manifest";
export declare class Router {
    private contentDownloadManager;
    init(app: any, manifest: Manifest, auth?: any): void;
    setConnectionTimeout(time: number): (req: any, res: any, next: any) => void;
    getLocals(manifest: any): Promise<any>;
}
