export interface IEndEventInput {
    'env': String;
    'objectId': String;
    'objectType': String;
    'objectVersion': String;
    'edataId': String;
    'pageId': String;
    'rollup'?: Object;
    'duration'?: String;
    'type': String;
    'mode': String;
    'summary': Array<Object>;
}
