export declare class ErrorObj {
    errCode: string;
    errMessage: string;
    constructor(errCode: string, errMessage: string);
}
export declare const getErrorObj: (error: any, errCode?: string) => ErrorObj;
export declare const handelError: (errCode: any) => (error: Error | ErrorObj) => never;
export interface ILogAPIFormat {
    appver: string;
    pageid: string;
    ts: number;
    log: string;
}
