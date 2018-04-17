import { IInteractEventData } from './telemetryEvent';
export interface IInteractEventInput {
    'context': {
        'env': String;
    };
    'object'?: {
        'id': String;
        'type': String;
        'ver'?: String;
        'rollup'?: Object;
    };
    'edata': IInteractEventData;
}
