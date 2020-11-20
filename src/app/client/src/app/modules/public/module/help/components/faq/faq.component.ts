import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { UtilService, ResourceService, LayoutService, NavigationHelperService, ToasterService, ConfigService } from '@sunbird/shared';
import { TenantService, PublicDataService } from '@sunbird/core';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { FaqService } from '../../services/faq/faq.service';

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
  defaultToEnglish = false;
  isDesktopApp = false;

  constructor(private http: HttpClient, private _cacheService: CacheService, private utilService: UtilService,
    public tenantService: TenantService, public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private layoutService: LayoutService, public navigationHelperService: NavigationHelperService, private location: Location,
    private router: Router, private telemetryService: TelemetryService,
    private faqService: FaqService, private toasterService: ToasterService,
    private configService: ConfigService, private publicDataService: PublicDataService) {
  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.setTelemetryImpression();
    this.initLayout();
    this.instance = _.upperCase(this.resourceService.instance);
    this.tenantService.tenantSettings$.subscribe((data) => {
      this.tenantFooter = data;
    });
    this.defaultFooterConfig = {
      helpCenterLink: `/help/faqs/user/index.html`,
      helpDeskEmail: `support@${_.lowerCase(this.instance)}-ncte.freshdesk.com`
    };
    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';

    if (this.isDesktopApp) {
      this.getDesktopFAQ(this.selectedLanguage);
    } else {
      this.faqService.getFaqJSON()
        .pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
          this.faqBaseUrl = _.get(data, 'result.response.value');
          this.getFaqJson();
        }, (err) => {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        });
    }

    this.utilService.languageChange.subscribe((langData) => {
      this.showLoader = true;
      this.selectedLanguage = _.get(langData, 'value') || 'en';
      this.getFaqJson();
    });
  }

  private getFaqJson() {
    this.faqList = undefined;
    this.http.get(`${this.faqBaseUrl}/faq-${this.selectedLanguage}.json`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.faqList = data;
      this.showLoader = false;
      this.defaultToEnglish = false;
    }, (err) => {
      if (_.get(err, 'status') === 404 && !this.defaultToEnglish) {
        this.selectedLanguage = 'en';
        this.defaultToEnglish = true;
        this.getFaqJson();
      } else {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
  }

  private getDesktopFAQ(languageCode = 'en') {
    const requestParams = {
      url: `${this.configService.urlConFig.URLS.OFFLINE.READ_FAQ}/${languageCode}`
    };
    this.publicDataService.get(requestParams).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.showLoader = false;
        this.faqList = _.get(response, 'result.faqs');
        this.defaultToEnglish = false;
      }, (error) => {
        if (_.get(error, 'status') === 404 && !this.defaultToEnglish) {
          this.selectedLanguage = 'en';
          this.defaultToEnglish = true;
          this.getDesktopFAQ();
        } else {
          this.showLoader = false;
          console.log(`Received Error while fetching faqs ${JSON.stringify(error.error)}`);
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
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
