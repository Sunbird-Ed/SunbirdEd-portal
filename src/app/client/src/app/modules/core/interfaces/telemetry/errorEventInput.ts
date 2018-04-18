import { IErrorEventData } from './telemetryEvent';
export interface IErrorEventInput {
    'context': {
        'env': String;
    };
    'object'?: {
        'id': String;
        'type': String;
        'ver'?: String;
        'rollup'?: Object;
    };
    'edata': IErrorEventData;
}
