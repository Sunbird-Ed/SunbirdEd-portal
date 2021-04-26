import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '@sunbird/shared';
import { map } from 'rxjs/operators';
import { get } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class UsageService {

  /**
   * angular HttpClient
   */
  http: HttpClient;
  /**
   * Constructor
   * @param {HttpClient} http HttpClient reference
   */
  constructor(http: HttpClient) {
    this.http = http;
  }

  getData(url: string, requestParam?: { params: any; }) {
    const httpOptions: HttpOptions = {
      responseType: 'json'
    };
    if (requestParam && requestParam.params) {
      httpOptions.params = requestParam.params;
    }
    return this.http.get(url, httpOptions)
      .pipe(
        map(res => {
          const result = {
            responseCode: 'OK'
          };
          result['result'] = get(res, 'result') || res;
          return result;
        })
      );
  }
}
