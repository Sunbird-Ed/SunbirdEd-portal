export interface IProgramsList {
    programs: IProgram[];
}

export interface IProgram {
    programId: string;
    config: IConfig;
    defaultRoles: string[];
    description: string;
    endDate: null;
    name: string;
    slug: string;
    startDate: string;
    status: null;
    type: string;
    userDetails: IUserDetails;
}

export interface IConfig {
    roles: IRole[];
    onBoardForm: IOnBoardForm;
    scope: IScope;
}

export interface IOnBoardForm {
    templateName: string;
    action: string;
    fields: IField[];
}

export interface IField {
    code: any;
    dataType: string;
    name: string;
    label: string;
    description: string;
    inputType: string;
    required: boolean;
    displayProperty: string;
    visible: boolean;
    range: Range[];
    index: number;
}
export interface IRange {
    identifier: string;
    code: string;
    name: string;
    description: string;
    index: number;
    category: any;
    status: any;
}
export interface IRole {
    role: string;
}

export interface IScope {
    board: string[];
    gradeLevel: string[];
    medium: string[];
    subject: string[];
    bloomsLevel: string[];
    framework: string;
    channel: string;
}

export interface IUserDetails {
    programId: string;
    userId: string;
    enrolledOn: string;
    onBoarded: boolean;
    onBoardingData: IOnBoardingData;
    roles: string[];
}

export interface IOnBoardingData {
    school: string;
}
