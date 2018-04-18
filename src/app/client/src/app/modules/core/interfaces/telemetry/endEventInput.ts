import { IEndEventData } from './telemetryEvent';
export interface IEndEventInput {
    'context': {
        'env': String;
    };
    'object'?: {
        'id': String;
        'type': String;
        'ver'?: String;
        'rollup'?: Object;
    };
    'edata': IEndEventData;
}
