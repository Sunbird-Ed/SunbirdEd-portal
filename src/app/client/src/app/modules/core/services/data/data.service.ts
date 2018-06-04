import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { TelemetryService, ILogEventInput } from '@sunbird/telemetry';

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
  private http: HttpClient;
  /**
   *
   *
   * @type {TelemetryService}
   * @memberof DataService
   */
  private telemetryService: TelemetryService;
  /**
   * Constructor
   * @param {HttpClient} http HttpClient reference
   */
  constructor(http: HttpClient, telemetryService: TelemetryService) {
    this.http = http;
    this.telemetryService = telemetryService;
  }

  /**
   * for making get api calls
   *
   * @param requestParam interface
   */
  get(requestParam: RequestParam, telemetry?: ILogEventInput): Observable<ServerResponse> {
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
      })
      .do(x => telemetry && this.telemetryService.log(telemetry))
      .catch((error) => {
        // tslint:disable-next-line:no-unused-expression
        telemetry && this.telemetryService.error({
          ...telemetry,
          edata: { err: _.get(error, 'params.err') || error.message, errtype: 'PORTAL', stacktrace: error.params || error.message }
        });
        return error;
      });
  }

  /**
   * for making post api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  post(requestParam: RequestParam, telemetry?: ILogEventInput): Observable<ServerResponse> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post(this.baseUrl + requestParam.url, requestParam.data, httpOptions)
      .flatMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return Observable.throw(data);
        }
        return Observable.of(data);
      })
      .do(x => telemetry && this.telemetryService.log(telemetry))
      .catch((error) => {
        // tslint:disable-next-line:no-unused-expression
        telemetry && this.telemetryService.error({
          ...telemetry,
          edata: { err: _.get(error, 'params.err') || error.message, errtype: 'PORTAL', stacktrace: error.params || error.message }
        });
        return error;
      });
  }

  /**
   * for making patch api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  patch(requestParam: RequestParam, telemetry?: ILogEventInput): Observable<ServerResponse> {
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
      })
      .do(x => telemetry && this.telemetryService.log(telemetry))
      .catch((error) => {
        // tslint:disable-next-line:no-unused-expression
        telemetry && this.telemetryService.error({
          ...telemetry,
          edata: { err: _.get(error, 'params.err') || error.message, errtype: 'PORTAL', stacktrace: error.params || error.message }
        });
        return error;
      });
  }

  /**
   * for making delete api calls
   * @param {RequestParam} requestParam interface
   */
  delete(requestParam: RequestParam, telemetry?: ILogEventInput): Observable<ServerResponse> {
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
      })
      .do(x => telemetry && this.telemetryService.log(telemetry))
      .catch((error) => {
        // tslint:disable-next-line:no-unused-expression
        telemetry && this.telemetryService.error({
          ...telemetry,
          edata: { err: _.get(error, 'params.err') || error.message, errtype: 'PORTAL', stacktrace: error.params || error.message }
        });
        return error;
      });
  }

  /**
   * for preparing headers
   */
  private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {
    const default_headers = {
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': this.rootOrgId,
      'X-Source': 'web',
      'ts': moment().format(),
      'X-msgid': UUID.UUID()
    };
    if (headers) {
      return { ...default_headers, ...headers };
    } else {
      return { ...default_headers };
    }
  }
}
