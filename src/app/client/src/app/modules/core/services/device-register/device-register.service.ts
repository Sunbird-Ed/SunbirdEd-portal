import { environment } from '@sunbird/environment';
import { Injectable } from '@angular/core';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService,  HttpOptions} from '@sunbird/shared';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import {Observable, timer, Subscription, of} from 'rxjs';
import * as _ from 'lodash-es';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceRegisterService  {
  private portalVersion: string;
  private appId: string;
  private deviceId: string;
  private deviceRegisterApi: string;
  private deviceProfileApi: string;
  private deviceAPIBaseURL: string;
  private timer$: Observable<any>;
  private timerSubscription: Subscription;
  deviceProfile: any;
  isOffline: boolean = environment.isOffline;

  constructor(public deviceDetectorService: DeviceDetectorService, public publicDataService: PublicDataService,
    private configService: ConfigService, private http: HttpClient) {

    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));

    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';

    this.appId = (<HTMLInputElement>document.getElementById('appId'))
    && (<HTMLInputElement>document.getElementById('appId')).value;

    this.deviceRegisterApi = (<HTMLInputElement>document.getElementById('deviceRegisterApi'))
      && (<HTMLInputElement>document.getElementById('deviceRegisterApi')).value;

    this.deviceProfileApi = (<HTMLInputElement>document.getElementById('deviceProfileApi'))
      && (<HTMLInputElement>document.getElementById('deviceProfileApi')).value;

    this.deviceAPIBaseURL = (<HTMLInputElement>document.getElementById('deviceApi'))
      && (<HTMLInputElement>document.getElementById('deviceApi')).value;

      if (this.isOffline) {
        this.deviceId = (<HTMLInputElement>document.getElementById('deviceId'))
        && (<HTMLInputElement>document.getElementById('deviceId')).value; }
  }

  public initialize() {
    this.registerDevice();
    this.timer$ = timer(3.6e+6, 3.6e+6);
    this.timerSubscription = this.timer$.subscribe(t => {
      this.registerDevice();
    });
  }

  setDeviceId() {
    this.deviceId = (<HTMLInputElement>document.getElementById('deviceId'))
      && (<HTMLInputElement>document.getElementById('deviceId')).value;
  }

  fetchDeviceProfile() {
    const httpOptions: HttpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return this.http.get(this.deviceAPIBaseURL + this.configService.urlConFig.URLS.DEVICE.PROFILE + this.deviceId, httpOptions);
  }

  getDeviceProfile() {
    if (this.deviceProfile) {
      return of(this.deviceProfile);
    }
    return this.fetchDeviceProfile().pipe(map(deviceProfile => {
      this.deviceProfile = _.get(deviceProfile, 'result');
      return this.deviceProfile;
    }));
  }

  registerDevice() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo(); // call register api every 24hrs
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
        did: this.deviceId,
        producer: this.appId,
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
    const httpOptions: HttpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    this.http.post(this.deviceAPIBaseURL + this.configService.urlConFig.URLS.DEVICE.REGISTER + this.deviceId, data, httpOptions)
    .subscribe(() => {
    });
  }

  updateDeviceProfile(userDeclaredLocation) {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo(); // call register api every 24hrs
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
        did: this.deviceId,
        producer: this.appId,
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        },
        userDeclaredLocation: {
          state: userDeclaredLocation.state || '',
          district: userDeclaredLocation.district || ''
        }
      }
    };
    const httpOptions: HttpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return this.http.post(this.deviceAPIBaseURL + this.configService.urlConFig.URLS.DEVICE.REGISTER + this.deviceId, data, httpOptions)
      .pipe(map((res) => {
        return res;
      }));
  }
}
