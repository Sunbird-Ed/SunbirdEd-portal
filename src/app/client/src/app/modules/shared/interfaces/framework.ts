import { ServerResponse } from './serverResponse';
export interface Framework {
    err: ServerResponse;
    framework: string;
    frameworkdata: FrameworkCategorie;
}
export interface FrameworkCategorie {
    Categories: Array<CategoriesData>;
}
export interface CategoriesData {
    code: string;
    description: string;
    identifier: string;
    index: number;
    name: string;
    status: string;
    terms: Array<TermsData>;
}
export interface TermsData {
    associations: Array<AssociationsData>;
    category: string;
    code: string;
    description: string;
    identifier: string;
    index: string;
    name: string;
    status: string;
}
export interface AssociationsData {
    category: string;
    code: string;
    description: string;
    identifier: string;
    index: string;
    name: string;
    status: string;
}
