export interface IMinCollection {
    identifier: string;
    mimeType: string;
    visibility: string;
    name: string;
    primaryCategory: string;
    additionalCategory: string;
    contentType: string;
    children?: Array<any>;
    selected?: boolean;
  }
