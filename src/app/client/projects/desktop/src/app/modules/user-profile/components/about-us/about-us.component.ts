import { IAppInfo } from './../../interfaces';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { AppUpdateService } from './../../../offline/services';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  instance: string;
  appInfo: IAppInfo;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractButtonEData: IInteractEventEdata;
  public telemetryInteractEData: IInteractEventEdata;
  constructor(public resourceService: ResourceService, private appUpdateService: AppUpdateService,
    private router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.getAppInfo();
  }

  getAppInfo() {
    this.appUpdateService.getAppInfo().pipe(takeUntil(this.unsubscribe$)).subscribe((response: ServerResponse) => {
      this.appInfo = _.get(response, 'result');
      this.setTelemetryData();
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
  setTelemetryData () {
    this.telemetryImpression = {
      context: { env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'about-us'},
      edata: {
        type: 'view',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'about-us',
        uri: this.router.url
      }
    };
    this.telemetryInteractButtonEData = {
      id: 'update-app-btn',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'about-us',
      extra: {
        newVersion: _.get(this.appInfo, 'updateInfo.version')
      }
    };
    this.telemetryInteractEData = {
      id: 'update-app-link',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'about-us',
      extra: {
        newVersion: _.get(this.appInfo, 'updateInfo.version')
      }
    };
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
