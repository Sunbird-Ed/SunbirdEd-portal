/**
 * Announcement interface
*/
export interface Announcement {
    /**
     * Announcement type Data
    */
    type: string;
    /**
     * Announcement title
    */
    title: string;
    /**
     * Announcement from
    */
    from: string;
    /**
     * Announcement is read or not
    */
    read: boolean;
    /**
     * Announcement description
    */
    description: string;
    /**
     * Announcement attached links
    */
    links: string[];
    /**
     * Announcement attachements
    */
    attachments: object[];
    /**
     * Announcement creation date
    */
    createdDate: string;
}
