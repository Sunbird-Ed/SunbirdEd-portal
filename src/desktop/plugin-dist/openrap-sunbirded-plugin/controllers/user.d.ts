import { Manifest } from "@project-sunbird/ext-framework-server/models";
export default class User {
    private userSDK;
    private settingSDK;
    constructor(manifest: Manifest);
    create(req: any, res: any): Promise<any>;
    read(req: any, res: any): Promise<any>;
    update(req: any, res: any): Promise<any>;
}
