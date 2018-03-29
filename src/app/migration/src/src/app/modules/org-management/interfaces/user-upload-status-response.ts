import { ServerResponse } from '@sunbird/shared';
export interface UserUploadStatusResponse {
    objectType: string;
    processId: string;
    successResult: Array<UserUploadStatusResult>;
    failureResult: Array<UserUploadStatusResult>;
}
export interface UserUploadStatusResult {
    dob: string;
    email: string;
    emailVerified: string;
    firstName: string;
    gender: string;
    grade: string;
    language: string;
    lastName: string;
    location: string;
    loginId: string;
    password: string;
    phone: string;
    phoneVerified: any;
    position: string;
    profileSummary: string;
    provider: string;
    regOrgId: string;
    roles: Array<string>;
    rootOrgId: string;
    subject: string;
    userId: string;
    userName: string;
}
