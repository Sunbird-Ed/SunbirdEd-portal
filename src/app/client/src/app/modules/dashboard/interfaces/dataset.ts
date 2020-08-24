enum DatasetType {
    onDemand,
    preComputed
}

export interface IDataset {
    datasetId: string;
    examples?: string;
    dataDictionary?: string;
    granularity?: string;
    lastUpdatedOn?: string;
    type?: DatasetType;
    downloadFormats: string[];
    months?: number;
    datasetFields?: any;
    dataAvailableFrom: string;
}

