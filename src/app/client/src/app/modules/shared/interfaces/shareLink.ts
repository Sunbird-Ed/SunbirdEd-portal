/**
 * ISharelink Interface
*/
export interface ISharelink {
    /**
    * classes of type string for icon and button
    * id content identifier
    * type of content type
    * data for share link
    */
    id?: string | 'icon' | 'button';
    classes?: string;
    type?: string;
    data?: object ;
}
