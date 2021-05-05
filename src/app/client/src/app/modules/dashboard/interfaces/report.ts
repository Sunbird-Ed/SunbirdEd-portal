export interface IListReportsFilter {
    slug?: Array<string>;
    type?: Array<string>;
    status?: Array<string>;
}

export interface IDataSource {
    id?: string;
    path: string;
}

export interface IReportConfig {
    reportid: string;
    title: string;
    description: string;
    authorizedroles: string[];
    status: string;
    type: string;
    reportaccessurl: string;
    createdon: string;
    updatedon: string;
    createdby: string;
    reportconfig: object;
    templateurl: null | string;
    slug: string;
    reportgenerateddate: string;
    reportduration: IReportduration;
    tags: string[];
    updatefrequency: string;
}

export interface IReportduration {
    enddate: string;
    startdate: string;
}

export interface IReportsApiResponse {
    count: number;
    reports: IReportConfig[];
}

export interface ISummaryObject {
    title: string;
    type: 'report' | 'chart';
    index?: number;
    chartId?: string;
    summary?: string;
    hash?: string;
}

