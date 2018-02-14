import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import * as  urlConFig from './url.config';
//const urlConFig = (<any>urlConfig);
@Injectable()
export class LearnerService  {
  constructor(public http: HttpClient) {
    //super(http, urlConFig.URLS.LEARNER_PREFIX);
  }

}
