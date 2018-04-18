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
