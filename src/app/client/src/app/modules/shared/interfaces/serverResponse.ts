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

    headers?: any;
}

/**
 * server response with headers
*/
export interface ServerResponseWithHeaders {
    statusText: string;
    ok: boolean;
    status: number;
    type: number;
    url: string;
    headers?: any;
    body?: any;
}

export interface Params {
    resmsgid: string;
    msgid?: any;
    err?: any;
    status: string;
    errmsg?: any;
}
