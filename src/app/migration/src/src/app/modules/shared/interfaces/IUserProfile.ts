import { ServerResponse } from '@sunbird/shared';
export interface UserProfile {
    missingFields?: Array<string>;
    lastName: string;
    webPages: Array<{type: string, url: string}>;
    tcStatus: any;
    loginId: string;
    education: Array<Education>;
    gender: string;
    regOrgId: string;
    subject: Array<string>;
    roles: Array<string>;
    language: Array<string>;
    updatedDate: string;
    completeness: number | string;
    skills: Array<Skill>;
    isDeleted: boolean | any;
    organisations: Array<Organization>;
    provider: string;
    countryCode: string;
    id: string;
    tempPassword: string;
    email: string;
    rootOrg: any;
    identifier: string;
    profileVisibility: any;
    thumbnail: any;
    updatedBy: string;
    address: Array<Address>;
    jobProfile: Array<JobProfile>;
    profileSummary: string;
    tcUpdatedDate: string;
    avatar: string;
    userName: string;
    rootOrgId: string;
    userId: string;
    emailVerified: string;
    firstName: string;
    lastLoginTime: number | string;
    createdDate: string;
    createdBy: string;
    phone: string;
    dob: string;
    registeredOrg: any;
    grade: Array<string>;
    currentLoginTime: string;
    location: string;
    status: number | string;
    userRoles?: Array<string>;
    orgRoleMap?: {[key: string]: Array<string>};
    organisationIds?: Array<string>;
}
export interface JobProfile {
    jobName: string;
    orgName: string;
    role: string;
    updatedBy: string;
    endDate: string;
    isVerified: string;
    subject: Array<string>;
    joiningDate: string;
    updatedDate: string;
    isCurrentJob: boolean;
    verifiedBy: string;
    userId: string;
    boardName: string;
    orgId: string;
    addressId: string;
    createdDate: string;
    isDeleted: boolean;
    createdBy: string;
    verifiedDate: string;
    isRejected: boolean | any;
    id: string;
}
export interface Address {
    country: string;
    updatedBy: string;
    city: string;
    updatedDate: string;
    userId: string;
    zipcode: string;
    addType: string;
    createdDate: string;
    isDeleted: boolean;
    createdBy: string;
    addressLine1: string;
    addressLine2: string;
    id: string;
    state: string;
}
export interface Organization {
    organisationId: string;
    updatedBy: string;
    addedByName: string;
    addedBy: string;
    roles: Array<string>;
    approvedBy: string;
    updatedDate: string;
    userId: string;
    approvaldate: string;
    isDeleted: boolean;
    isRejected: boolean;
    id: string;
    position: string;
    isApproved: boolean | any;
    orgjoindate: string;
    orgLeftDate: string;
}
export interface Education {
    updatedBy: string;
    yearOfPassing: number | string;
    degree: string;
    updatedDate: string;
    userId: string;
    addressId: any;
    duration: any;
    courseName: string;
    createdDate: string;
    isDeleted: string;
    createdBy: string;
    boardOrUniversity: string;
    grade: string;
    percentage: number | string;
    name: string;
    id: string;
}

export interface Skill {
    skillName: string;
    addedAt: string;
    endorsersList: Array<{endorseDate: string, userId: string}>;
    addedBy: string;
    endorsementcount: number;
    id: string;
    skillNameToLowercase: string;
    userId: string;
}
export interface UserData {
    err: ServerResponse;
    userProfile: UserProfile;
}
