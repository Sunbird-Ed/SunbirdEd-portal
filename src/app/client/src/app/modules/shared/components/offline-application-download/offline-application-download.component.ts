import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResourceService } from './../../services';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-application-download',
  templateUrl: './offline-application-download.component.html',
  styleUrls: ['./offline-application-download.component.scss']
})
export class OfflineApplicationDownloadComponent implements OnInit, AfterViewInit {

  public telemetryImpression: IImpressionEventInput;
  instance: string;
  recomanded_download: string;
  recomandedOS: string;
  otherOption1: string;
  otherOption2: string;
  /* it stores the release date of the offline desktop app from env variable.*/
  public desktopAppReleaseDate = (<HTMLInputElement>document.getElementById('offlineDesktopAppReleaseDate')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppReleaseDate')).value : '';

  /* it stores the version of the offline desktop app from env variable.*/
  public desktopAppVersion = (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')).value : '';

  /* it stores the supported languages of offline desktop app from env variable.*/
  public desktopAppSupportedLanguage = (<HTMLInputElement>document.getElementById('offlineDesktopAppSupportedLanguage')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppSupportedLanguage')).value : '';

  public appDownloadUrl = (<HTMLInputElement>document.getElementById('offlineDesktopAppDownloadUrl')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppDownloadUrl')).value : '';

  constructor( public resourceService: ResourceService, public router: Router, public deviceDetectorService: DeviceDetectorService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    const userAgent = deviceInfo.userAgent;
    const os = deviceInfo.os;
    this.recomanded_download = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows32');
    this.otherOption1 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows64');
    this.otherOption2 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForLinux');
    if (os.toLowerCase() === 'windows') {
      if (userAgent.toLowerCase().indexOf('win32') >= 0 ) {
        this.recomanded_download = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows32');
        this.otherOption1 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows64');
        this.otherOption2 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForLinux');
      } else if (userAgent.toLowerCase().indexOf('win64') >= 0) {
        this.recomanded_download = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows64');
        this.otherOption1 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows32');
        this.otherOption2 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForLinux');
      }
    } else if (os.toLowerCase() === 'linux') {
      this.recomandedOS = 'linux';
      this.recomanded_download = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForLinux');
      this.otherOption1 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows32');
      this.otherOption2 = _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows64');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: 'download-app'
      },
      edata: {
        type: 'view',
        pageid: 'offline-application-download',
        uri: this.router.url
      }
    };
  }

  downloadApp(downloadApp: string) {
    const appDownloadUrl = this.appDownloadUrl;
    if (appDownloadUrl) {
      switch (downloadApp) {
        case _.get(this.resourceService, 'frmelmnts.btn.downloadAppForLinux'):
          window.open(appDownloadUrl + '/desktop/latest/' + this.instance + '_' + this.desktopAppVersion + '_linux64bit.deb');
          break;
        case _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows32'):
          window.open(appDownloadUrl + '/desktop/latest/' + this.instance + '_' + this.desktopAppVersion + '_windows32bit.exe');
          break;
        case _.get(this.resourceService, 'frmelmnts.btn.downloadAppForWindows64'):
          window.open(appDownloadUrl + '/desktop/latest/' + this.instance + '_' + this.desktopAppVersion + '_windows64bit.exe');
          break;
      }
    }
    // window.open(this.appDownloadUrl);
  }
}
