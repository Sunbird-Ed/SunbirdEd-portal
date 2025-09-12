export interface ISelectFilterBase {
contentType?: Array<string>;
searchText: string;
}

export interface ISelectFilter extends ISelectFilterBase {
    [key: string]: Array<string> | string;
}
