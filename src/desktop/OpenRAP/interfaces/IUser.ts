export interface IUser {
  _id?: string;
  name?: string;
  formatedName?: string;
  framework: IFramework;
  createdOn?: number;
  updatedOn?: number;
  role?: string;
}

export interface IFramework {
  board: string,
  medium: Array<string>,
  gradeLevel: Array<string>,
  subject?: Array<string>
}

export interface ILoggedInUser {
  _id?: string;
  id: string;
  userId: string;
  identifier: string;
  accessToken?: string;
  firstName: string;
  lastName?: string;
  rootOrg?: RootOrg;
  promptTnC?: boolean;
  tncAcceptedVersion?: string;
  tncAcceptedOn?: string;
  tncLatestVersion?: string;
  tncLatestVersionUrl?: string;
  allTncAccepted?: {
    [key: string]: {
      tncAcceptedOn: string;
      version: string;
    } | undefined;
  };
  avatar?: string;
  managedBy?: string;
  locationIds?: string;
  framework?: any;
  externalIds?: {
    id: string;
    operation: string;
    idType: string;
    provider: string;
  }[];
  rootOrgName?: string;
  channel?: string;
  stateValidated?: boolean;
  isDeleted?: boolean;
  countryCode?: string;
  maskedEmail?: string;
  email?: string;
  phone?: string;
  phoneVerified?: boolean;
  rootOrgId?: string;
  emailVerified?: boolean;
  userType?: string;
  status?: number
}

export interface RootOrg {
  rootOrgId?: string;
  orgName?: string;
  slug?: string;
  hashTagId: string;
}