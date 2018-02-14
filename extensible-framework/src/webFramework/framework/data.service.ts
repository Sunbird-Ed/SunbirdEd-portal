import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import moment from 'moment-es6';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
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
  public baseUrl:any
  constructor(public http: HttpClient) {
  }

 get(requestParam: any,baseUrl:any) {
    this.baseUrl = baseUrl;
    const httpOptions = {
      headers: this.getHeader(),
      params: <any>requestParam.param
    };
    return this.http.get(this.baseUrl + requestParam.url, httpOptions)

  }

  // post(requestParam: RequestParam) {
  //   const httpOptions = {
  //     headers: this.getHeader(),
  //     params: (<any>requestParam.param)
  //   };
  //   return this.http.post(this.baseUrl + requestParam.url, requestParam.data, httpOptions);
  // }

  // update(requestParam: RequestParam) {
  //   return this.http.patch(this.baseUrl + requestParam.url, requestParam.data);
  // }

  // delete(requestParam: RequestParam) {
  //   return this.http.delete(this.baseUrl + requestParam.url);
  // }
  private addParam() {
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
