/**
 * server response
*/
export interface ServerResponse {
    /**
     * api id
    */
    id: string;
    /**
     * response param
    */
    params: Params;
    /**
     * response code
    */
    responseCode: string;
    /**
     * server result
    */
    result: any;
    /**
     * time stamp
    */
    ts: string;
    /**
     * api version
    */
    ver: string;
}

export interface Params {
    resmsgid: string;
    msgid?: any;
    err?: any;
    status: string;
    errmsg?: any;
}
