import {IContents} from './content';
import {IAction} from './action';
export interface ICaraouselData {
    name: string;
    length: number;
    contents?: Array<IContents>;
}

export interface IContents {
    name: string;
    description?: string;
    me_averageRating?: number;
    leafNodesCount: number;
    progress?: number;
    appIcon?: string;
    identifier?: string;
    courseId?: string;
    action?: IAction;
}
export interface IAction {
type?: {
    dual?: boolean;
    button?: boolean;
    icon?: boolean;
    rating?: boolean;
};
classes?: {
    button?: string;
    icon?: string;
};
label?: string;
}

