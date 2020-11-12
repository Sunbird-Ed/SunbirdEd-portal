export declare enum IAddedUsingType {
    import = "import",
    download = "download"
}
export interface IDesktopAppMetadata {
    "ecarFile"?: string;
    "addedUsing": IAddedUsingType;
    "createdOn": number;
    "updatedOn": number;
    "updateAvailable"?: boolean;
    "lastUpdateCheckedOn"?: number;
    "isAvailable"?: boolean;
}
export interface IContentDelete {
    _id: string;
    _rev?: string;
    identifier: string;
    mimeType?: string;
    desktopAppMetadata: IDesktopAppMetadata;
    childNodes?: string[];
}
export interface IDeletePath {
    path?: string;
}
