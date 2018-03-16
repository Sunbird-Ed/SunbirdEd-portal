/**
 * Action Interface has few combination to send the type
 * 1)any one- button content or icon or rating or dual
 * 2)button and rating
 * 3)icon and rating
*/
export interface IAction {
    /**
     * It contains 4 type
     * 1)If button is needed then select button
     * 2)If icon is needed then select icon
     * 3)if rating is needed then select rating
     * 4)If both button and icon is needed then select dual
    */
    type: {
        dual?: boolean;
        button?: boolean;
        icon?: boolean;
        rating?: boolean;
    };
    /**
     *It contain classess for button and icon.
     * It contains 2 type
     * 1)If button is needed then have to pass
     * the class of what button needed.
     * 2)If icon is needed then have to pass
     * the class of what icon neeeded.
    */
    classes?: {
        button?: string;
        icon?: string;
    };
    /**
     * It contains the label for button
    */
    label?: string;
}
