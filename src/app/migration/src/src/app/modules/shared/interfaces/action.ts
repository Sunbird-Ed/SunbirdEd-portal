/**
 * Action Interface has few combination to send the type
 * 1)any one- button content or icon or rating or dual
 * 2)button and rating
 * 3)icon and rating
*/
export interface IAction {
    right?: {
        displayType?: 'icon' | 'button'
        classes?: string;
        text?: string;
        clickable?: boolean;
        actionType?: 'delete' | string;
    };

    left?: {
        displayType?: 'icon' | 'rating'
        classes?: string;
        text?: string;
        clickable?: boolean;
        actionType?: 'share' | string;
    };
}
