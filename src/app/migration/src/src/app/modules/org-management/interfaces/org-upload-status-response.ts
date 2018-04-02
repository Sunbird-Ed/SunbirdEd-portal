import { ServerResponse } from '@sunbird/shared';
export interface IOrgUploadStatusResponse {
    objectType: string;
    processId: string;
    successResult: Array<IOrgUploadStatusResult>;
    failureResult: Array<IOrgUploadStatusResult>;
}
export interface IOrgUploadStatusResult {
    orgName: string;
    homeUrl: string;
    orgType: string;
    err_msg: string;
    preferredLanguage: string;
    orgCode: string;
    channel: string;
    externalId: string;
    description: string;
    theme: string;
    isRootOrg: string;
    id: string;
    contactDetail: Array<string>;
}
