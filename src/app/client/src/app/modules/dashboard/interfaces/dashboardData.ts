export interface DashboardData {
    /**
     * Chart data
     */
    bucketData: any;

    /**
     * Contains dashboard block data
     */
    numericData: string[];

    /**
     * Dashboard data series
     */
    series: string[] | string;

    /**
     * Chart Y-axes label
     */
    name?: string;
}

export interface ICourseProgressData {
    batchEndsOn: string;
    enrolledOn: string;
    lastAccessTime?: any;
    org?: string;
    progress: number;
    user: string;
    userName: string;
}

export interface IBatchListData {
    countDecrementDate?: any;
    countDecrementStatus?: boolean;
    countIncrementDate?: any;
    countIncrementStatus?: boolean;
    courseAdditionalInfo?: any;
    courseCreator: string;
    courseId: string;
    createdBy: string;
    createdDate: string;
    createdFor?: any;
    description?: string;
    endDate?: string;
    enrollmentType?: string;
    hashTagId?: string;
    id: string;
    identifier?: string;
    mentors?: Array<string>;
    name: string;
    participant?: Array<any>;
    startDate?: string;
    status?: Number;
    updatedDate?: any;
}
