import { Component, HostListener, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { UtilService, ResourceService, LayoutService, NavigationHelperService, ToasterService, ConfigService, ContentUtilsServiceService } from '@sunbird/shared';
import { TenantService, PublicDataService } from '@sunbird/core';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { FaqService } from '../../services/faq/faq.service';
import { VideoConfig } from './faq-data';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqData: any;
  faqBaseUrl: string;
  selectedLanguage: string;
  showLoader = true;
  instance: string;
  defaultFooterConfig: any;
  layoutConfiguration: any;
  unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  defaultToEnglish = false;
  isDesktopApp = false;
  helpCenterLink = '/help/faqs/user/index.html';
  selectedFaqCategory: any;
  isMobileView = false;
  showFaqReport: boolean;
  showOnlyFaqCategory = true;
  @ViewChild('sbFaqCategoryList', { static: false }) sbFaqCategoryList;
  @ViewChildren('videoPlayer') videoPlayer;
  showVideoModal = false;
  playerConfig: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event && event.target && event.target.innerWidth) {
      this.checkScreenView(event.target && event.target.innerWidth);
    }
  }

  constructor(private http: HttpClient, private _cacheService: CacheService, private utilService: UtilService,
    public tenantService: TenantService, public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private layoutService: LayoutService, public navigationHelperService: NavigationHelperService, private location: Location,
    private router: Router, private telemetryService: TelemetryService,
    private faqService: FaqService, private toasterService: ToasterService,
    private configService: ConfigService, private publicDataService: PublicDataService,
    public contentUtilsServiceService: ContentUtilsServiceService) {
  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.setTelemetryImpression();
    this.initLayout();
    this.instance = _.upperCase(this.resourceService.instance);
    this.defaultFooterConfig = {
      helpCenterLink: this.helpCenterLink,
      helpDeskEmail: `support@${_.lowerCase(this.instance)}-ncte.freshdesk.com`
    };

    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';

    if (this.isDesktopApp) {
      const baseUrl = this.utilService.getAppBaseUrl();
      this.defaultFooterConfig.helpCenterLink = `${baseUrl}${this.helpCenterLink}`;
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

      if (this.isDesktopApp) {
        this.getDesktopFAQ(this.selectedLanguage);
      } else {
        this.getFaqJson();
      }
    });
    this.checkScreenView(window.innerWidth);
  }

  private getFaqJson() {
    this.faqData = undefined;
    this.http.get(`${this.faqBaseUrl}/faq-${this.selectedLanguage}.json`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.selectInitialCategory(data);
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
    this.faqData = undefined;
    this.publicDataService.get(requestParams).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.showLoader = false;
        const faqData = _.get(response, 'result.faqs');
        this.selectInitialCategory(faqData);
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

  private selectInitialCategory(data) {
    if (_.get(data, 'categories.length')) {
      this.faqData = this.prepareFaqData(data);
      this.selectedFaqCategory = _.get(this.faqData, 'categories.0');
        setTimeout(() => {
          if (this.sbFaqCategoryList && this.sbFaqCategoryList.selectedIndex !== undefined) {
            this.sbFaqCategoryList.selectedIndex = 0
          }
        }, 0);
    }
  }

  private prepareFaqData(data){
    for (let i = 0; i < data.categories.length; i++) {
      if (_.get(data.categories[i], 'faqs.length')) {
        for (let j = 0; j < data.categories[i].faqs.length; j++) {
          data.categories[i].faqs[j].topic = _.replace(data.categories[i].faqs[j].topic, /{instance}/g, this.instance);
          data.categories[i].faqs[j].description = _.replace(data.categories[i].faqs[j].description, /{instance}/g, this.instance);
        }
      }
      if (_.get(data.categories[i], 'videos.length')) {
        for (let j = 0; j < data.categories[i].videos.length; j++) {
          data.categories[i].videos[j].name = _.replace(data.categories[i].videos[j].name, /{instance}/g, this.instance);
        }
      }
    }
    return data;
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
    if (!this.showOnlyFaqCategory && this.isMobileView) {
      this.showOnlyFaqCategory = true;
      return;
    }
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

  onCategorySelect(event) {
    this.showOnlyFaqCategory = false;
    this.showFaqReport = false;
    this.selectedFaqCategory = undefined;
    if (!event || !event.data) {
      return;
    }
    setTimeout(() => {
      const faqCategory = event.data;
      faqCategory.constants = this.faqData.constants;
      this.selectedFaqCategory = faqCategory;
    }, 0);
  }

  checkScreenView(width) {
    if (width <= 767) {
      this.isMobileView = true;
      this.showOnlyFaqCategory = true;
    } else {
      this.isMobileView = false;
    }
  }

  onVideoSelect(event) {
    if (!event || !event.data) {
      return;
    }

    const video = VideoConfig;
    video.metadata.appIcon = event.data.thumbnail;
    video.metadata.name = event.data.name;
    video.metadata.artifactUrl = event.data.url;

    this.playerConfig = video
    this.showVideoModal = true;

    this.videoPlayer.changes.subscribe(() => {
      if (_.get(document.getElementsByClassName('sb-player-side-menu-icon'), '0.style'))  {
        document.getElementsByClassName('sb-player-side-menu-icon')[0]['style'].display = 'none';
      }
    });
  }

  enableFaqReport(event) {
    this.showOnlyFaqCategory = false;
    this.showFaqReport = true;
    if (this.sbFaqCategoryList && this.sbFaqCategoryList.selectedIndex !== undefined) {
      this.sbFaqCategoryList.selectedIndex = -1
    }
  }

}
