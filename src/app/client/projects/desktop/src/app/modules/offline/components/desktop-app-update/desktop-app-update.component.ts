import { ResourceService, ServerResponse } from '@sunbird/shared';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppUpdateService } from './../../services/app-update/app-update.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-desktop-app-update',
  templateUrl: './desktop-app-update.component.html',
  styleUrls: ['./desktop-app-update.component.scss']
})
export class DesktopAppUpdateComponent implements OnInit, OnDestroy {

  isUpdated;
  downloadUrl: string;
  public unsubscribe$ = new Subject<void>();
  telemetryInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  newVersion;

  constructor(public appUpdateService: AppUpdateService, public resourceService: ResourceService) { }

  ngOnInit() {
    this.checkForAppUpdate();
  }

  checkForAppUpdate() {
    this.appUpdateService.checkForAppUpdate().pipe(takeUntil(this.unsubscribe$)).subscribe((response: ServerResponse) => {
      this.isUpdated = _.get(response, 'result.updateAvailable');
      this.downloadUrl = _.get(response, 'result.url');
      this.newVersion = _.get(response, 'result.version');
      this.setTelemetry();
    }, (error) => {
        console.log(`Received Error while checking app update Error: ${JSON.stringify(error.error)}`);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setTelemetry() {
  this.telemetryInteractObject = {
      id: 'app-update',
      type: 'click',
      ver: <HTMLInputElement>document.getElementById('buildNumber') ?
           (<HTMLInputElement>document.getElementById('buildNumber')).value : '1.0.0'
    };

    this.telemetryInteractEdata =  {
      id: 'app-update',
      type: 'click',
      pageid: 'library',
      extra: {
        newVersion: this.newVersion
      }
    };
  }
}
