import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResourceService } from './../../services';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-offline-application-download',
  templateUrl: './offline-application-download.component.html',
  styleUrls: ['./offline-application-download.component.scss']
})
export class OfflineApplicationDownloadComponent implements OnInit, AfterViewInit {

  public telemetryImpression: IImpressionEventInput;

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

  constructor( public resourceService: ResourceService, public router: Router) { }

  ngOnInit() {
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

  downloadApp() {
    window.open(this.appDownloadUrl);
  }
}
