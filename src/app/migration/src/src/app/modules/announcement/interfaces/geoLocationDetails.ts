/**
 * Location item object
 */
export interface IGeoLocationDetails {
    /**
     * Contains created date
     */
    createdDate: string;
    /**
     * Contains updated date
     */
    updatedBy: string | null;
    /**
     * Contains user count
     */
    userCount: number | null;
    /**
     * Contains created by id
     */
    createdBy: string;
    /**
     * Contains usercountTTL info
     */
    userCountTTL: string;
    /**
     * Contains topic info
     */
    topic: string;
    /**
     * Contains location name
     */
    location: string;
    /**
     * Contains location id
     */
    id: string;
    /**
     * Location update date
     */
    updatedDate: string | null;
    /**
     * Location type
     */
    type: string;
    /**
     * Location root org id
     */
    rootOrgId: string;
    /**
     * Contains checkbox selected value
     */
    selected?: boolean;
}
