export interface ContentDetails {
    contentId: string;
    contentData: ContentData;
    courseId?: string;
    batchId?: string;
}

export interface ContentDataBase {
    body: any;
    mimeType: string;
    contentType: string;
    identifier: string;
    versionKey: string;
    name: string;
    me_averageRating: string | number;
    description: string;
    appIcon?: string;
    artifactUrl?: string;
    audience?: any;
    code: string;
    collections?: any;
    concepts?: any;
    createdBy?: string;
    createdOn?: string;
    creator?: string;
    contributors?: string;
    attributions?: Array<string>;
    creators?: string;
    owner?: string;
    framework: string;
    gradeLevel?: Array<string>;
    language?: Array<string>;
    languageCode?: string;
    lastUpdatedOn?: string;
    mediaType?: string;
    medium?: string;
    organisationIds?: Array<string>;
    osId?: string;
    publisher?: string;
    status: string;
    usedByContent?: any;
    userId: string;
    userName: string;
    pkgVersion?: string;
    visibility?: string;
    copyright?: string;
    originData?: any;
    primaryCategory?: string;
    additionalCategories?: Array<string>;
}

export interface ContentData extends ContentDataBase {
    [key: string]: any;
}

export interface ContentCreditsData {
    contributors: string;
    creators: string;
    attributions: string;
    copyright?: string;
}
