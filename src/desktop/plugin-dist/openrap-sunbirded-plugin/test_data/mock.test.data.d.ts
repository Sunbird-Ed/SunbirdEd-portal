export declare const location_state: {
    result: {
        response: {
            'code': string;
            'name': string;
            'id': string;
            'type': string;
        }[];
    };
};
export declare const location_state_empty: {
    result: {
        response: any[];
    };
};
export declare const location_district: {
    result: {
        response: {
            "code": string;
            "name": string;
            "id": string;
            "type": string;
            "parentId": string;
        }[];
    };
};
export declare const location_district_empty: {
    result: {
        response: any[];
    };
};
export declare const appUpdate: {
    termsOfUseUrl: string;
    deviceId: string;
    languages: string;
    releaseDate: string;
    updateInfo: {
        updateAvailable: boolean;
        url: string;
        version: string;
    };
};
export declare const not_updated: {
    termsOfUseUrl: string;
    deviceId: string;
    languages: string;
    releaseDate: string;
    updateInfo: {
        updateAvailable: boolean;
    };
};
export declare const app_update_error: {
    'id': string;
    'ver': string;
    'ts': string;
    'params': {
        'resmsgid': string;
        'msgid': string;
        'status': string;
        'err': string;
        'errmsg': string;
    };
    'responseCode': string;
    'result': {
        'deviceId': string;
        'languages': string;
        'releaseDate': string;
    };
};
export declare const get_content_error: {
    id: string;
    ver: string;
    ts: string;
    params: {
        resmsgid: string;
        msgid: string;
        status: string;
        err: string;
        errmsg: string;
    };
    responseCode: string;
    result: {};
};
