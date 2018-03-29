import { ServerResponse } from '@sunbird/shared';
export interface OrgUploadStatusResponse {
    objectType: string;
    processId: string;
    successResult: Array<OrgUploadStatusResult>;
    failureResult: Array<OrgUploadStatusResult>;
}
export interface OrgUploadStatusResult {
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
