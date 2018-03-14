
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
