export interface ILogEventInput {
    'env': String;
    'objectId'?: String;
    'objectType'?: String;
    'objectVersion'?: String;
    'rollup'?: Object;
    'type': String;
    'level': String;
    'message': String;
    'params'?: Array<Object>;
}
