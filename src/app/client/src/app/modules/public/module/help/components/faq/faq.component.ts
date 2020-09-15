import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { UtilService, ResourceService, LayoutService, NavigationHelperService } from '@sunbird/shared';
import { TenantService } from '@sunbird/core';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqList: any;
  faqBaseUrl: string;
  selectedLanguage: string;
  showLoader = true;
  instance: string;
  tenantFooter: any;
  defaultFooterConfig: any;
  layoutConfiguration: any;
  unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;

  constructor(private http: HttpClient, private _cacheService: CacheService, private utilService: UtilService,
    public tenantService: TenantService, public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private layoutService: LayoutService, public navigationHelperService: NavigationHelperService, private location: Location,
    private router: Router, private telemetryService: TelemetryService) {
    this.faqBaseUrl = 'https://ntpstagingall.blob.core.windows.net/public/faq/resources/res';
  }

  ngOnInit() {
    this.setTelemetryImpression();
    this.initLayout();
    this.instance = _.upperCase(this.resourceService.instance);
    this.tenantService.tenantSettings$.subscribe((data) => {
      this.tenantFooter = data;
    });
    this.defaultFooterConfig = {
      helpCenterLink: '/help/getting-started/explore-' + _.lowerCase(this.instance) + '/index.html',
      helpDeskEmail: 'support@' + _.lowerCase(this.instance) + '-ncte.freshdesk.com'
    };
    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';
    this.getFaqJson();
    this.utilService.languageChange.subscribe((langData) => {
      this.showLoader = true;
      this.selectedLanguage = _.get(langData, 'value') || 'en';
      this.getFaqJson();
    });
  }

  setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

  private getFaqJson() {
    this.faqList = undefined;
    this.http.get(`${this.faqBaseUrl}/faq-${this.selectedLanguage}.json`).subscribe(data => {
      this.faqList = data;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    });
  }

  goBack() {
    this.location.back();
  }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid')
    };
  }

  logInteractEvent(event, subtype: string) {
    const cardClickInteractData = {
      context: {
        cdata: [],
        env: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.env'),
      },
      edata: {
        id: 'faq',
        subtype,
        type: 'TOUCH',
        pageid: _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid'),
        extra: { values: event.data }
      }
    };
    this.telemetryService.interact(cardClickInteractData);
  }

}
