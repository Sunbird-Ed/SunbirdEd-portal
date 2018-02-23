
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

interface RequestParam {
  url: string;
  param?: object;
  header?: object;
  data?: object;
}

@Injectable()
export class DataService {
  headers: object;
  rootOrgId = '';
  baseUrl: string;
  constructor(public http: HttpClient) {
  }

  get(requestParam: RequestParam) {
    const httpOptions = {
      headers: (<any>requestParam.header) ? (<any>requestParam.header) : this.getHeader(),
      params: (<any>requestParam.param)
    };
    return this.http.get(this.baseUrl + requestParam.url, httpOptions)
    .flatMap((data: any) => {
      if (data.responseCode !== 'OK') {
        return Observable.throw(data);
      }
      return Observable.of(data);
    });
  }

  post(requestParam: RequestParam) {
    const httpOptions = {
      headers: (<any>requestParam.header) ? (<any>requestParam.header) : this.getHeader(),
      params: (<any>requestParam.param)
    };
    return this.http.post(this.baseUrl + requestParam.url, requestParam.data , httpOptions)
    .flatMap((data: any) => {
      if (data.responseCode !== 'OK') {
        return Observable.throw(data);
      }
      return Observable.of(data);
    });
  }

  patch(requestParam: RequestParam) {
    return this.http.patch(this.baseUrl + requestParam.url, requestParam.data);
  }

  delete(requestParam: RequestParam) {
    const option = { headers: this.getHeader(), body: requestParam.data };
    return this.http.delete(this.baseUrl + requestParam.url, option);
  }
  private getHeader() {
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
