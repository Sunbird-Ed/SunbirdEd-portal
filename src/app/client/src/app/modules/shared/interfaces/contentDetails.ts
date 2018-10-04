export interface ContentDetails {
    contentId: string;
    contentData: ContentData;
    courseId?: string;
    batchHashTagId?: string;
}

export interface ContentData {
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
    attributions?: Array<string>;
}

export interface ContentCreditsData {
    contributors: string;
    creators: string;
}
