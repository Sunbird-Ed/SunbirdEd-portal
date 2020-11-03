export interface ITelemetrySkipped {
    id: string;
    reason: string;
}
export declare class ErrorObj {
    errCode: string;
    errMessage: string;
    constructor(errCode: string, errMessage: string);
}
export declare const getErrorObj: (error: any, errCode?: string) => ErrorObj;
export declare const handelError: (errCode: any) => (error: Error | ErrorObj) => never;
