import { ServerResponse } from './serverResponse';
export interface Framework {
    err: ServerResponse;
    framework: string;
    frameworkdata: FrameworkCategorie;
}
export interface FrameworkCategorie {
    Categories: any;
}
