import { Injectable } from '@angular/core';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService,  HttpOptions} from '@sunbird/shared';
import * as dayjs from 'dayjs';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import {Observable, timer, Subscription, of} from 'rxjs';
import * as _ from 'lodash-es';
import {map} from 'rxjs/operators';
import {DeviceService} from '../device/device.service';

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

  constructor(public deviceDetectorService: DeviceDetectorService, public publicDataService: PublicDataService,
              private deviceService: DeviceService,
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
    const options = {
      url: this.configService.urlConFig.URLS.DEVICE.PROFILE + this.deviceId
    };
    return this.deviceService.get(options);
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
      ts: dayjs().format(),
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
    const options = {
      url: this.configService.urlConFig.URLS.DEVICE.REGISTER + this.deviceId,
      data: data
    };
    this.deviceService.post(options)
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
      ts: dayjs().format(),
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
    const options = {
      url: this.configService.urlConFig.URLS.DEVICE.REGISTER + this.deviceId,
      data: data
    };
    return this.deviceService.post(options)
      .pipe(map((res) => {
        return res;
      }));
  }
}
