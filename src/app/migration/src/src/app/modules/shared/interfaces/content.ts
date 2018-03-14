import {IAction} from './action';
    export interface IContents {
        name: string;
        courseName?: string;
        description?: string;
        me_averageRating?: number;
        leafNodesCount: number;
        progress?: number;
        appIcon?: string;
        courseLogoUrl?: string;
        resourceType?: string;
        contentType?: string;
        identifier?: string;
        courseId?: string;
        action?: IAction;
    }
