import { ConfigService } from './../config/config.service';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class ResourceService extends DataService {
  messages: any = {};
  frmelmnts: any = {};
  constructor(public config: ConfigService, public http: HttpClient) {
    super(http);
    this.baseUrl = this.config.urlConFig.URLS.RESOURCEBUNDLES_PREFIX;
    this.getResource().subscribe(
      (data: any) => {
          this.messages = data.result.messages;
          this.frmelmnts = data.result.frmelmnts;
      },
      err => {
        console.log('error in getting resource', err);
      }
    );
   }
   public getResource() {
    const option = {
      url: this.config.urlConFig.URLS.RESOURCEBUNDLES.ENG
    };
      return this.get(option);
   }

}
