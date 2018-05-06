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
}
