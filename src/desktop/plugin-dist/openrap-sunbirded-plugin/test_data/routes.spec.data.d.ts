export declare const frameworkConfig: {
    db: {
        cassandra: {
            contactPoints: string[];
        };
        elasticsearch: {
            host: string;
            disabledApis: string[];
        };
        couchdb: {
            url: string;
        };
        pouchdb: {
            path: string;
        };
    };
    plugins: {
        id: string;
        ver: string;
    }[];
    pluginBasePath: string;
    logBasePath: string;
};
export declare const env: {
    APP_BASE_URL: string;
    CHANNEL: string;
    TELEMETRY_SYNC_INTERVAL_IN_SECS: string;
    APP_ID: string;
    TELEMETRY_PACKET_SIZE: string;
    APP_BASE_URL_TOKEN: string;
    APP_NAME: string;
    MODE: string;
    APPLICATION_PORT: string;
    DATABASE_PATH: string;
    FILES_PATH: string;
};
export declare const registerDevice: {
    id: string;
    ver: string;
    ts: string;
    params: {
        msgid: string;
    };
    request: {
        did: string;
        producer: string;
        uaspec: {
            agent: string;
            ver: string;
            system: string;
            platform: string;
            raw: string;
        };
    };
};
export declare const telemetry_v1: {
    id: string;
    ver: string;
    ets: number;
    events: ({
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: any[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id?: undefined;
            type?: undefined;
            ver?: undefined;
            rollup?: undefined;
        };
        tags: string[];
        edata: {
            type: string;
            level: string;
            message: string;
            pageid: string;
            uri?: undefined;
            subtype?: undefined;
            duration?: undefined;
            visits?: undefined;
            id?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: any[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id?: undefined;
            type?: undefined;
            ver?: undefined;
            rollup?: undefined;
        };
        tags: string[];
        edata: {
            type: string;
            pageid: string;
            uri: string;
            subtype: string;
            duration: number;
            visits: {
                objid: string;
                objtype: string;
                index: number;
                section: string;
            }[];
            level?: undefined;
            message?: undefined;
            id?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: any[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id?: undefined;
            type?: undefined;
            ver?: undefined;
            rollup?: undefined;
        };
        tags: string[];
        edata: {
            id: string;
            type: string;
            pageid: string;
            level?: undefined;
            message?: undefined;
            uri?: undefined;
            subtype?: undefined;
            duration?: undefined;
            visits?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: {
                id: string;
                type: string;
            };
            rollup: {
                l1: string;
            };
        };
        object: {
            id: string;
            type: string;
            ver: string;
            rollup: {};
        };
        tags: string[];
        edata: {
            id: string;
            type: string;
            pageid: string;
            level?: undefined;
            message?: undefined;
            uri?: undefined;
            subtype?: undefined;
            duration?: undefined;
            visits?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: any[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id: string;
            type: string;
            ver: string;
            rollup: {};
        };
        tags: string[];
        edata: {
            type: string;
            pageid: string;
            uri: string;
            subtype: string;
            duration: number;
            level?: undefined;
            message?: undefined;
            visits?: undefined;
            id?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: any[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id: string;
            type: string;
            ver: string;
            rollup: {};
        };
        tags: string[];
        edata: {
            id: string;
            type: string;
            pageid: string;
            level?: undefined;
            message?: undefined;
            uri?: undefined;
            subtype?: undefined;
            duration?: undefined;
            visits?: undefined;
        };
    })[];
};
export declare const error_telemetry_v1: {
    id: string;
    ver: string;
    ets: number;
};
export declare const telemetry_v3: {
    id: string;
    ver: string;
    ets: number;
    events: ({
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: {
                id: string;
                type: string;
            }[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id: string;
            type: string;
            ver: string;
            rollup: {};
        };
        tags: any[];
        edata: {
            type: string;
            mode: string;
            pageid: string;
            duration: number;
            summary?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: {
                id: string;
                type: string;
            }[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id: string;
            type: string;
            ver: string;
            rollup: {};
        };
        tags: any[];
        edata: {
            type: string;
            pageid: string;
            mode?: undefined;
            duration?: undefined;
            summary?: undefined;
        };
    } | {
        eid: string;
        ets: number;
        ver: string;
        mid: string;
        actor: {
            id: string;
            type: string;
        };
        context: {
            channel: string;
            pdata: {
                id: string;
                ver: string;
                pid: string;
            };
            env: string;
            sid: string;
            did: string;
            cdata: {
                id: string;
                type: string;
            }[];
            rollup: {
                l1: string;
            };
        };
        object: {
            id: string;
            type: string;
            ver: string;
            rollup: {};
        };
        tags: any[];
        edata: {
            type: string;
            mode: string;
            pageid: string;
            summary: {
                progress: number;
            }[];
            duration: number;
        };
    })[];
};
export declare const error_telemetry_v3: {
    id: string;
    ver: string;
    ets: number;
    events: any[];
};
