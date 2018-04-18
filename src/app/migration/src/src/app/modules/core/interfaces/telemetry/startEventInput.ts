import { IStartEventData } from './telemetryEvent';
export interface IStartEventInput {
    'context': {
        'env': String;
        'cdata'?: Array<Object>;
    };
    'object'?: {
        'id': String;
        'type': String;
        'ver'?: String;
        'rollup'?: Object;
    };
    'edata': IStartEventData;
}
