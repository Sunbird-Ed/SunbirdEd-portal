import { ServerResponse } from './serverResponse';
export interface IUserData {
    err: ServerResponse;
    userProfile: IUserProfile;
}
export interface IUserProfileBase {
    missingFields?: Array<string>;
    badgeAssertions?: Array<string>;
    lastName: string;
    webPages: Array<{ type: string, url: string }>;
    tcStatus: any;
    loginId: string;
    education: Array<IEducation>;
    gender: string;
    regOrgId: string;
    roles: Array<string>;
    language: Array<string>;
    updatedDate: string;
    completeness: number | string;
    skills: Array<ISkill>;
    isDeleted: boolean | any;
    organisations: Array<IOrganization>;
    provider: string;
    countryCode: string;
    id: string;
    tempPassword: string;
    email: string;
    rootOrg: any;
    rootOrgAdmin?: boolean;
    identifier: string;
    profileVisibility: any;
    thumbnail: any;
    updatedBy: string;
    address: Array<IAddress>;
    jobProfile: Array<IJobProfile>;
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
    currentLoginTime: string;
    location: string;
    status: number | string;
    userRoles?: Array<string>;
    orgRoleMap?: { [key: string]: Array<string> };
    roleOrgMap?: { [key: string]: string };
    organisationIds?: Array<string>;
    hashTagIds?: Array<string>;
    framework?: any;
    tncAcceptedVersion?: string;
    tncAcceptedOn?: string;
    tncLatestVersion?: string;
    promptTnC?: boolean;
    tncLatestVersionUrl?: string;
    managedBy?: string;
    userOrgDetails?: any;
}

export interface IUserProfile extends IUserProfileBase {
    [key: string]: Array<string> | Array<IAddress> | Array<IJobProfile> | any;
}

export interface IJobProfileBase {
    jobName: string;
    orgName: string;
    role: string;
    updatedBy: string;
    endDate: string;
    isVerified: string;
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

export interface IJobProfile extends IJobProfileBase {
    [key: string]: Array<string> | any;
}
export interface IAddress {
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
export interface IOrganization {
    organisationId: string;
    identifier: string;
    orgName: string;
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
    hashTagId?: string;
}
export interface IEducation {
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

export interface ISkill {
    skillName: string;
    addedAt: string;
    endorsersList: Array<{ endorseDate: string, userId: string }>;
    addedBy: string;
    endorsementcount: number;
    id: string;
    skillNameToLowercase: string;
    userId: string;
}
export interface IBasicInfo {
    id: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    email?: string;
    gender?: string;
    dob?: string;
    location?: string;
    grade?: Array<string>;
    language: Array<string>;
    subject?: Array<string>;
    webPages?: Array<{ type: string, url: string }>;
}

