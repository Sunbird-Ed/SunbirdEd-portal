export interface IStartEventInput {
    'env': String;
    'objectId': String;
    'objectType': String;
    'objectVersion': String;
    'contentType': String;
    'pageId': String;
    'mode': String;
    'cdata'?: Array<Object>;
    'rollup'?: Object;
}
