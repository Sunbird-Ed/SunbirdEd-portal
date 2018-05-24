import { ServerResponse } from './serverResponse';
export interface CourseStates {
    err: ServerResponse;
    courseProgressData: CourseProgress;
}

export interface CourseProgress {
    [key: string]: CourseProgressData;
}

export interface CourseProgressData {
    progress: number;
    totalCount: number;
    completedCount: number;
    content: Array<ContentList>;
}

export interface ContentList {
    lastAccessTime: string;
    contentId: string;
    batchId: string;
    completedCount: number;
    viewCount: number;
    courseId: string;
    lastCompletedTime: string;
    status: number;
}
