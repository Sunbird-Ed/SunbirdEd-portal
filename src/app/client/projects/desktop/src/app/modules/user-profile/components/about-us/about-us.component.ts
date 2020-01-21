import { IAppInfo } from './../../interfaces';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { ResourceService, ServerResponse, ILoaderMessage, ToasterService } from '@sunbird/shared';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { AppUpdateService, ConnectionService } from './../../../offline/services';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
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
  public telemetryTermsOfUseEData: IInteractEventEdata;
  tncLatestVersionUrl;
  showModal = false;
  showLoader = true;
  count = 0;
  loaderMessage: ILoaderMessage = {};
  currentYear;
  public isConnected;
  constructor(public resourceService: ResourceService, private appUpdateService: AppUpdateService,
    private router: Router, public activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private toasterService: ToasterService,
    public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.checkOnlineStatus();
    this.currentYear = new Date().getFullYear();
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0129
    };
    this.instance = _.upperCase(this.resourceService.instance);
    this.getAppInfo();
  }

  checkOnlineStatus() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  getAppInfo() {
    this.appUpdateService.getAppInfo().pipe(takeUntil(this.unsubscribe$)).subscribe((response: ServerResponse) => {
      this.appInfo = _.get(response, 'result');
      this.tncLatestVersionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.appInfo.termsOfUseUrl);
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

  toggleTocModal() {
    if (this.isConnected && this.tncLatestVersionUrl) {
      this.showLoader = true;
      this.showModal = !this.showModal;
    } else {
      this.toasterService.error(this.resourceService.frmelmnts.emsg.desktop.termsOfUse);
    }

  }

  isIframeLoaded() {
    this.count++;
    this.showLoader = this.count === 2 ? (this.count = 0, false) : true;
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
    this.telemetryTermsOfUseEData = {
      id: 'terms-of-use',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'about-us',
    };
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
