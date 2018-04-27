/**
 * Action Interface has few combination to send button or icon
 * 1)right is for right side of section.
 * 2)left is for left side of section.
*/
export interface IAction {
    /**
     * right side of section
     * 1)displayType can be icon or button
     * 2)classes of type string for icon and button
     * 3)text of type string for button
     * 4)clickable of type boolean if icon or button is clickable
     * 5)actionType is of string
     */
    right?: {
        displayType?: string | 'icon' | 'button'
        classes?: string;
        text?: string;
        clickable?: boolean;
        actionType?: 'delete' | string;
    };
    /**
     * left side of section
     * 1)displayType can be icon or rating
     * 2)classes of type string for icon
     * 3)clickable of type boolean if icon or button is clickable
     * 4)actionType is of string
     */

    left?: {
        displayType?: string | 'icon' | 'rating '
        classes?: string;
        clickable?: boolean;
        actionType?: 'share' | 'shareComponent' | string  ;
        icon?: string;
        mimeType?: string;
        identifier?: string;
        contentType?: string
    };
}
