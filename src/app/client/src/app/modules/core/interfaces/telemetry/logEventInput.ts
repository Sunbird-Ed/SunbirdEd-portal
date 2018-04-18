import { ILogEventData } from './telemetryEvent';
export interface ILogEventInput {
    'context': {
        'env': String;
    };
    'object'?: {
        'id': String;
        'type': String;
        'ver'?: String;
        'rollup'?: Object;
    };
    'edata': ILogEventData;
}
