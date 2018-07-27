import { IRouter } from '@project-sunbird/ext-framework-server/interfaces';
import { Manifest } from '@project-sunbird/ext-framework-server/models/Manifest';
export declare class Router implements IRouter {
    init(app: any, manifest: Manifest, auth?: any): void;
}
