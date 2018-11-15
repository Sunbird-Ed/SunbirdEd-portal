import { Injectable } from '@angular/core';
import { PublicDataService } from './../public-data/public-data.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ConfigService, RequestParam,  HttpOptions} from '@sunbird/shared';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeviceRegisterService {
  deviceInfo: DeviceInfo;
  portalVersion: string;
  appId: string;
  deviceId: string;
  api: string;
  apiKey: string;
  constructor(public publicDataService: PublicDataService, private deviceDetectorService: DeviceDetectorService,
    private configService: ConfigService, private http: HttpClient) {
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const appId = (<HTMLInputElement>document.getElementById('appId'));
    this.appId = appId ? appId.value : 'sunbird-portal';
    const api = (<HTMLInputElement>document.getElementById('deviceRegisterApi'));
    this.api = api && api.value;
    const apiKey = (<HTMLInputElement>document.getElementById('deviceRegisterApiKey'));
    this.apiKey = apiKey &&  apiKey.value;
  }
  registerDevice(channel: string, deviceId?: string) {
    console.log('calling registerDevice');
    this.deviceId = (<HTMLInputElement>document.getElementById('deviceId'))
    && (<HTMLInputElement>document.getElementById('deviceId')).value;
    const data = {
      id: this.appId,
      ver: this.portalVersion,
      ts: moment().format(),
      params: {
        msgid: UUID.UUID()
      },
      request: {
        channel: channel,
        dspec: {
          os: this.deviceInfo.os,
          browser: this.deviceInfo.browser,
          device: this.deviceInfo.device
        }
      }
    };
    const httpOptions: HttpOptions = {
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json'
      }
    };
    this.http.post(this.api + this.deviceId, data, httpOptions)
    .subscribe(() => {
    }, (err) => {
      console.log('called device', err);
    });
  }
}
