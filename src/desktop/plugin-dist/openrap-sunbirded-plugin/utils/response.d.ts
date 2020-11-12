export default class Response {
    static success(id: any, result: any, req: any): {
        id: any;
        ver: string;
        ts: string;
        params: {
            resmsgid: string;
            msgid: string;
            status: string;
            err: any;
            errmsg: any;
        };
        responseCode: string;
        result: any;
    };
    static error(id: any, responseCode: any, errmsg?: any, errCode?: any): {};
}
