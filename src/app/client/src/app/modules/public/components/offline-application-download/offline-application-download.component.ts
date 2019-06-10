import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-offline-application-download',
  templateUrl: './offline-application-download.component.html',
  styleUrls: ['./offline-application-download.component.scss']
})
export class OfflineApplicationDownloadComponent implements OnInit {

  /* it stores the release date of the offline desktop app from env variable.*/
  public desktopAppReleaseDate = (<HTMLInputElement>document.getElementById('offlineDesktopAppReleaseDate')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppReleaseDate')).value : '';

  /* it stores the version of the offline desktop app from env variable.*/
  public desktopAppVersion = (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppVersion')).value : '';

  /* it stores the supported languages of offline desktop app from env variable.*/
  public desktopAppSupportedLanguage = (<HTMLInputElement>document.getElementById('offlineDesktopAppSupportedLanguage')) ?
  (<HTMLInputElement>document.getElementById('offlineDesktopAppSupportedLanguage')).value : '';

  constructor( public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
