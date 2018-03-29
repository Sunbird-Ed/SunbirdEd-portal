export interface  IStartEventData  {
    'type': String,
    'mode': String,
    'duration'?: String,
    'pageid': String,
    'uaspec': Object
};

export interface  ITelemetryContextData {
    'channel': String,
    'pdata'?: Object,
    'env': String,
    'sid'?: String,
    'did'?: String,
    'cdata'?: Array<Object>,
    'rollup'?: Object
}

export interface  TelemetryObject {
    "id": String,
    "type": String,
    "ver"?: String,
    "rollup": Object
}
type TelemetryEventOptions = {
    'context'?: ITelemetryContextData,
    'object'?: TelemetryObject,
    'tags'?: Array<String>
};


export interface ITelemetryEvent {
    'edata': IStartEventData ,
    'contentId': String,
    'contentVer': String,
    'options': TelemetryEventOptions
}


