import { HttpParams, HttpHeaders } from '@angular/common/http';
/**
 * http method options
*/
export interface HttpOptions {
  /**
   * http header
  */
    headers?: HttpHeaders | {[header: string]: string | any};
  /**
   * http params
  */
    params?: HttpParams | {
        [param: string]: string | string[];
    };
  /**
   * report Progress
  */
    reportProgress?: boolean;
  /**
   * response Type
  */
    responseType?: 'json';
  /**
   * body for delete
  */
    body?: any;

    /**
   * if value is response , headers will be returned in api response
  */
    observe?: any;

}
