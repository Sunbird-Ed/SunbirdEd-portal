export interface IGeoJSON {
    type: string;
    features: Feature[];
}

export interface Feature {
    type: FeatureType;
    geometry: Geometry;
    properties: Properties;
}

export interface Geometry {
    type: GeometryType;
    coordinates: Array<Array<number[]>>;
}

export enum GeometryType {
    Polygon = 'Polygon',
}

export interface Properties {
    [key: string]: any;
}

export enum FeatureType {
    Feature = 'Feature',
}

export interface ICustomMapObj {
    drillDown: boolean;
    name: string;
    fitBounds: boolean;
    district?: string;
    st_nm?: string;
    dt_code?: string | number;
    st_code?: string | number;
}


export interface IInputMapData {
    state: string;
    districts?: string[];
    metrics?: string[];
    folder?: string;
    labelExpr?: string;
    reportLoc?: string;
    reportData?: string;
    strict?: boolean;
    country?: string;
    states?: string[];
}
