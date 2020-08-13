enum DatasetType {
    onDemand,
    preComputed
}

export interface IDownloadFormat {
    availableFormats: string[];
    default: string;
}

export interface IDataset {
    datasetId: string;
    examples?: string;
    dataDictionary?: string;
    granularity: string;
    lastUpdatedOn: string;
    type: DatasetType;
    downloadFormat: IDownloadFormat;
    months?: number;
    datasetFields?: any

}

