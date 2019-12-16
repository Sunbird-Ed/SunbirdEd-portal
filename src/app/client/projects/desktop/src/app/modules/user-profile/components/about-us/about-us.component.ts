import { takeUntil } from 'rxjs/operators';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { AppUpdateService } from '@sunbird/offline';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  instance: string;
  appInfo = {};
  public unsubscribe$ = new Subject<void>();

  constructor(public resourceService: ResourceService, public appUpdateService: AppUpdateService) {}

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.getAppData();
    this.checkForAppUpdate();
    this.getAppLanguagesAndReleaseDate();
  }

  checkForAppUpdate() {
    this.appUpdateService.checkForAppUpdate().pipe(takeUntil(this.unsubscribe$)).subscribe((response: ServerResponse) => {
      this.appInfo['updatedData'] = _.get(response, 'result');
    }, (error) => {
        console.log(`Received Error while checking app update Error: ${JSON.stringify(error.error)}`);
    });
  }
  getAppData() {
    this.appInfo['buildNumber'] = <HTMLInputElement>document.getElementById('buildNumber') ?
    (<HTMLInputElement>document.getElementById('buildNumber')).value : '';
    this.appInfo['deviceId'] = <HTMLInputElement>document.getElementById('deviceId') ?
    (<HTMLInputElement>document.getElementById('deviceId')).value : '';
  }

  getAppLanguagesAndReleaseDate() {
    this.appUpdateService.getAppLanguagesAndReleaseDate().pipe(takeUntil(this.unsubscribe$)).subscribe((response: ServerResponse) => {
      this.appInfo['appData'] = _.get(response, 'result');
    });
  }

  updateApp (url) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
