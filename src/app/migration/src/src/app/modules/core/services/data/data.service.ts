import { ServerResponse, RequestParam , HttpOptions } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/**
 * Service to provide base CRUD methods to make api request.
 *
 */
@Injectable()
export class DataService {
  /**
   * Contains rootOrg Id
   */
  rootOrgId = '';
  /**
   * Contains base Url for api end points
   */
  baseUrl: string;
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

  /**
   * for making get api calls
   *
   * @param requestParam interface
   */
  get(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    return this.http.get(this.baseUrl + requestParam.url, httpOptions)
    .flatMap((data: ServerResponse) => {
      if (data.responseCode !== 'OK') {
        return Observable.throw(data);
      }
      return Observable.of(data);
    });
  }

  /**
   * for making post api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  post(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post(this.baseUrl + requestParam.url, requestParam.data , httpOptions)
    .flatMap((data: ServerResponse) => {
      if (data.responseCode !== 'OK') {
        return Observable.throw(data);
      }
      return Observable.of(data);
    });
  }

  /**
   * for making patch api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  patch(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    return this.http.patch(this.baseUrl + requestParam.url, requestParam.data, httpOptions)
    .flatMap((data: ServerResponse) => {
      if (data.responseCode !== 'OK') {
        return Observable.throw(data);
      }
      return Observable.of(data);
    });
  }

  /**
   * for making delete api calls
   * @param {RequestParam} requestParam interface
   */
  delete(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param,
      body: requestParam.data
    };
    return this.http.delete(this.baseUrl + requestParam.url, httpOptions)
    .flatMap((data: ServerResponse) => {
      if (data.responseCode !== 'OK') {
        return Observable.throw(data);
      }
      return Observable.of(data);
    });
  }

  /**
   * for preparing headers
   */
  private getHeader(): HttpOptions['headers'] {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': this.rootOrgId,
      'X-Source': 'web',
      'ts': moment().format(),
      'X-msgid': UUID.UUID()
    };
  }
}
