import { ServerResponse } from '@sunbird/shared';
export interface IUserUploadStatusResponse {
    objectType: string;
    processId: string;
    successResult: Array<IUserUploadStatusResult>;
    failureResult: Array<IUserUploadStatusResult>;
}
export interface IUserUploadStatusResult {
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
