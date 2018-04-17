import { IImpressionEventData } from './telemetryEvent';
export interface IImpressionEventInput {
    'context': {
        'env': String;
    };
    'object'?: {
        'id': String;
        'type': String;
        'ver'?: String;
        'rollup'?: Object;
    };
    'edata': IImpressionEventData;
}
