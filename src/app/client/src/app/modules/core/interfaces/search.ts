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
   * Content concept
   */
  concept?: Array<object>;
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
  filters?: any;
  /**
  * filters sort_by
  */
  sort_by?: { [key: string]: string };
  /**
    * filters badgeAssertions
  */
  softConstraints?: object;
  /**
    * facet filters
  */
 facets?: Array<string>;
}
