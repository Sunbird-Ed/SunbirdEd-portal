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
    params: object;
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
