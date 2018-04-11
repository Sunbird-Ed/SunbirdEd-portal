export interface IImpressionEventInput {
    'env': String;
    'objectId': String;
    'objectType': String;
    'objectVersion': String;
    'type': String;
    'subType': String;
    'uri': String;
    'pageId': String;
    'visits'?: Array<Object>;
}
