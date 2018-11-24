import { ServerResponse } from './serverResponse';
export interface Framework {
    err: ServerResponse;
    frameworkdata: FrameworkData;
}
export interface FrameworkData {
    [keys: string]: FrameworkCategories | any;
}
export interface FrameworkCategories {
    code: string;
    description: string;
    identifier: string;
    name: string;
    objectType: string;
    type: string;
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
