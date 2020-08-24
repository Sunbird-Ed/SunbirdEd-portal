export interface IDataset {
    datasetId: string;
    examples?: string;
    dataDictionary?: string;
    granularity?: string;
    lastUpdatedOn?: string;
    type?: string;
    downloadFormats: string[];
    months?: number;
    datasetFields?: any;
    dataAvailableFrom: string;
}

