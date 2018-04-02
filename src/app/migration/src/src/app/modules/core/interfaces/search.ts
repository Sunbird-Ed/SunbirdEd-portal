/**
 * Interface
 */
export interface SearchParam {

    /**
     * Content status
     */
    status?: string[];
    /**
     * Content type - course,textbook,content
     */
    contentType?: string[];

    /**
     * Additional params - userId, lastUpdatedOn, sort etc
     */
    params?: any;
    /**
     * createdBy id
     */
    createdBy?: string;
    /**
     * Organization ids
     */
    orgid?: string[];
    /**
    * page limit
    */
   limit?: number;
   /**
    * page offset
    */
   offset?: number;

   pageNumber?: number;
   /**
    * page mimeType
    */
   mimeType?: Array<string>;
   /**
    * page query
    */
   query?: string;
   /**
    * page channel
    */
   channel?: string;
   /**
    * page objectType
    */
   objectType?: string[];
   /**
    * filters param
    */
   filters?: string[];

  }
