export declare enum ImportSteps {
    copyEcar = "COPY_ECAR",
    parseEcar = "PARSE_ECAR",
    extractEcar = "EXTRACT_ECAR",
    processContents = "PROCESS_CONTENTS",
    complete = "COMPLETE"
}
export declare enum ImportProgress {
    "COPY_ECAR" = 1,
    "PARSE_ECAR" = 25,
    "EXTRACT_ECAR" = 26,
    "EXTRACT_ARTIFACT" = 90,
    "PROCESS_CONTENTS" = 99,
    "COMPLETE" = 100
}
export declare enum ImportStatus {
    reconcile = 0,
    resume = 1,
    inQueue = 2,
    inProgress = 3,
    pausing = 4,
    paused = 5,
    canceling = 6,
    canceled = 7,
    completed = 8,
    failed = 9
}
export interface IContentImport {
    _id: string;
    _rev?: string;
    status: ImportStatus;
    type: string;
    name: string;
    createdOn: number;
    updatedOn: number;
    progress: number;
    contentSize: number;
    contentId?: string;
    mimeType?: string;
    contentType?: string;
    pkgVersion?: string;
    failedCode?: string;
    failedReason?: string;
    ecarSourcePath: string;
    importStep?: ImportSteps;
    extractedEcarEntries: object;
    artifactUnzipped: object;
    childNodes?: string[];
    contentAdded?: string[];
    contentSkipped?: IContentSkipped[];
}
export interface IContentImportData {
    contentSize: number;
    contentId?: string;
    mimeType?: string;
    contentType?: string;
    pkgVersion?: string;
    ecarSourcePath: string;
    step?: ImportSteps;
    extractedEcarEntries: object;
    artifactUnzipped: object;
    childNodes?: string[];
    contentAdded?: string[];
    contentSkipped?: IContentSkipped[];
}
export interface IContentSkipped {
    id: string;
    reason: string;
}
export interface IContentManifest {
    archive: {
        items: any[];
    };
}
export declare class ErrorObj {
    errCode: string;
    errMessage: string;
    constructor(errCode: string, errMessage: string);
}
export declare const getErrorObj: (error: any, errCode?: string) => ErrorObj;
export declare const handelError: (errCode: any) => (error: Error | ErrorObj) => never;
