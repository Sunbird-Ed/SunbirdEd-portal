    /**
    * page interface
    */
export interface IPageSection {
    /**
    * page source
    */
    source?: string;
    /**
    * page name
    */
    name?: string;
    /**
    * page filters
    */
    filters?: object;
    /**
    * page sort by
    */
    sort_by?: object;
    /**
    * filters badgeAssertions, channel
    */
    softConstraints?: object;
    /**
     * mode : soft
     */
    mode?: string;
    exists?: Array<string>;
    params?: object;
    organisationId?: string;
    sections?: object;
     /**
    * page fields
    */
   fields?: object;
}
