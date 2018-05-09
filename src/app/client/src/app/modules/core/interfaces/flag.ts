export interface IFlagData {
    flagReasons?: string;
    comment?: string;
}

export interface IFlagReason {
    name: string;
    value: string;
    description?: string;
}

export interface IRequestData {
    flaggedBy?: string;
   versionKey?: string;
     flagReasons?: Array<string>;
     flags?: Array<string>;
 }

