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
    id?: string ;
    icon?: string;
    type?: string;
    contentType?: string;
    mimeType?: string;
    identifier?: string;
}
