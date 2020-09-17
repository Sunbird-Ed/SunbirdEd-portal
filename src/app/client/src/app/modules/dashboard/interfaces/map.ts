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
    Polygon = "Polygon",
}

export interface Properties {
    [key: string]: any;
}

export enum FeatureType {
    Feature = "Feature",
}
