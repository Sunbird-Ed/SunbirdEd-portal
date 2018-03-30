/**
 * Parameters for api calls
*/
export interface RequestParam {
    /**
     * http data
    */
  url: string;
    /**
     * http params
    */
  param?: {[key: string]: string | string[]};
    /**
     * http header
    */
  header?: {[key: string]: string | string[]};
    /**
     * http data
    */
  data?: any;
}
