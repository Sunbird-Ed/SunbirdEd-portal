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
param?: any;
  /**
   * http header
  */
header?: {[key: string]: string | string[]};
  /**
   * http data
  */
data?: any;
}
