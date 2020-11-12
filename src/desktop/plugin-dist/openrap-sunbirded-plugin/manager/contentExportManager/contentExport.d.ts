export declare class ExportContent {
    private destFolder;
    private dbParentNode;
    private dbChildNodes;
    private contentBaseFolder;
    private parentArchive;
    private parentManifest;
    private ecarName;
    private corruptContents;
    private startTime;
    private cb;
    private settingSDK;
    constructor(destFolder: any, dbParentNode: any, dbChildNodes: any);
    export(cb: any): Promise<void>;
    private loadParentCollection;
    private loadChildNodes;
    private loadContent;
    private validContent;
    private loadZipContent;
    private streamZip;
    private archiveAppend;
    private readDirectory;
    private getManifestBuffer;
    private getContentBaseFolder;
}
