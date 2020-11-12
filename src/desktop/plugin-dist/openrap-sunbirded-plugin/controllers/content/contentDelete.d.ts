import { Manifest } from "@project-sunbird/ext-framework-server/models";
import { IContentDelete } from "./IContent";
export default class ContentDelete {
    private databaseSdk;
    private systemQueue;
    constructor(manifest: Manifest);
    delete(req: any, res: any): Promise<any>;
    add(contentDeletePaths: string[], name: any): Promise<string[]>;
    getContentsToDelete(contentsToDelete: IContentDelete[]): Promise<IContentDelete[]>;
    getResources(content: {}): Promise<object[]>;
}
