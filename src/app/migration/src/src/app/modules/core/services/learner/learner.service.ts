import { ConfigService } from './../config/config.service';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LearnerService extends DataService {
  constructor(public config: ConfigService, public http: HttpClient) {
    super(http);
    this.baseUrl = this.config.urlConFig.URLS.LEARNER_PREFIX;
  }
}
