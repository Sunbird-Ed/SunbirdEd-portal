
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';

/**
 * Service to provide base CRUD methods to make api request.
 *
 */
@Injectable()
export class DataService {
  /**
   * Contains rootOrg Id
   */
  rootOrgId: string;
  /**
   * Contains channel Id
   */
  channelId: string;
  appId: string;
  /**
   * Contains devoce Id
   */
  deviceId: string;
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
    return this.http.get(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  /**
   * for making post api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  post(requestParam: RequestParam): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
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
    return this.http.patch(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
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
    return this.http.delete(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  /**
   * for preparing headers
   */
  private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {
    const default_headers = {
      'Accept': 'application/json',
      // 'X-Consumer-ID': 'X-Consumer-ID',
      'X-Source': 'web',
      'ts': moment().format(),
      'X-msgid': UUID.UUID()
    };
    try {
      this.deviceId = (<HTMLInputElement>document.getElementById('deviceId')).value;
    } catch (err) { }
    if (this.deviceId) {
      default_headers['X-Device-ID'] = this.deviceId;
    }
    if (this.rootOrgId) {
      default_headers['X-Org-code'] = this.rootOrgId;
    }
    if (this.channelId) {
      default_headers['X-Channel-Id'] = this.channelId;
    }
    if (headers) {
      return { ...default_headers, ...headers };
    } else {
      return { ...default_headers };
    }
  }
}
