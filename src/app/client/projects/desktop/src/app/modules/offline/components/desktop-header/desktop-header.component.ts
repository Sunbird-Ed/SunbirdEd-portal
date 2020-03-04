import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { first, takeUntil, filter } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';

import { OrgDetailsService, FormService, TenantService } from '@sunbird/core';
import { ConfigService, ResourceService, UtilService, ILanguage } from '@sunbird/shared';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: [
    './desktop-header.component.scss',
    './desktop-header-menubar.component.scss',
    './desktop-header-search.component.scss'
  ]
})
export class DesktopHeaderComponent implements OnInit, OnDestroy {
  appLanguage: ILanguage;
  availableLanguages: ILanguage[];
  unsubscribe$ = new Subject<void>();
  pageId = 'library';

  languageFormQuery = {
    formType: 'content',
    formAction: 'search',
    filterEnv: 'resourcebundle'
  };
  showQrModal = false;
  queryParam: any = {};
  tenantInfo: any = {};
  hideHeader = false;
  showLoadContentModal = false;
  constructor(
    public router: Router,
    public orgDetailsService: OrgDetailsService,
    private _cacheService: CacheService,
    public configService: ConfigService,
    public formService: FormService,
    public resourceService: ResourceService,
    public tenantService: TenantService,
    private utilService: UtilService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.orgDetailsService.orgDetails$.pipe(first()).subscribe(data => {
      if (data && !data.err) {
        this.getLanguage(data.orgDetails.hashTagId);
      }
    });

    this.getTenantInfo();
    this.utilService.searchQuery$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.clearSearchQuery());

    this.utilService.searchKeyword
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((keyword: string) => {
        this.updateSearchKeyword(keyword);
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.pageId = _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid') || 'library';
      });

    this.utilService.hideHeaderTabs
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((hideHeader) => {
        this.hideHeader = hideHeader;
      });

  }

  getTenantInfo() {
    this.tenantService.tenantData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ tenantData }) => {
        if (tenantData) {
          this.tenantInfo.logo = tenantData.logo ? tenantData.logo : undefined;
          this.tenantInfo.titleName = tenantData.titleName
            ? tenantData.titleName.toUpperCase()
            : undefined;
        }
      });
  }

  navigateToHome() {
    this.router.navigate(['']);
  }

  getLanguage(channelId) {
    const isCachedDataExists = this._cacheService.get(
      this.languageFormQuery.filterEnv + this.languageFormQuery.formAction
    );
    if (isCachedDataExists) {
      this.availableLanguages = isCachedDataExists[0].range;
    } else {
      const formServiceInputParams = {
        formType: this.languageFormQuery.formType,
        formAction: this.languageFormQuery.formAction,
        contentType: this.languageFormQuery.filterEnv
      };
      this.formService
        .getFormConfig(formServiceInputParams, channelId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            this.availableLanguages = data[0].range;
            this._cacheService.set(
              this.languageFormQuery.filterEnv +
              this.languageFormQuery.formAction,
              data,
              {
                maxAge:
                  this.configService.appConfig.cacheServiceConfig
                    .setTimeInMinutes *
                  this.configService.appConfig.cacheServiceConfig
                    .setTimeInSeconds
              }
            );
          },
          (err: any) => {
            this.availableLanguages = [
              { value: 'en', label: 'English', dir: 'ltr' }
            ];
          }
        );
    }
  }

  onEnter(key) {
    this.queryParam = {};
    if (key && key.length) {
      this.queryParam.key = key;
      this.router.navigate(['search'], { queryParams: this.queryParam });
    }
  }

  getSearchButtonInteractEdata(searchKey) {
    const searchInteractEData = this.getTelemetryEdata('search');

    if (searchKey) {
      searchInteractEData['extra'] = {
        query: searchKey
      };
    }

    return searchInteractEData;
  }

  clearSearchQuery() {
    this.queryParam = {};
  }

  updateSearchKeyword(keyword: string) {
    this.queryParam.key = keyword;
  }

  handleImportContentDialog() {
      this.showLoadContentModal = !this.showLoadContentModal;
  }
  getTelemetryEdata(key) {
    const interactData = {
      contentImport: {
        id: 'content-import-button',
        type: 'click',
        pageid: this.pageId
      },
      myLibrary: {
        id: 'my-downloads-tab',
        type: 'click',
        pageid: this.pageId
      },
      browse: {
        id: 'browse-tab',
        type: 'click',
        pageid: this.pageId
      },
      helpCenter: {
        id: 'help-center-tab',
        type: 'click',
        pageid: this.pageId
      },
      enterDialCode: {
        id: 'click-dial-code',
        type: 'click',
        pageid: this.pageId
      },
      takeTour: {
        id: 'take-tour-button',
        type: 'click',
        pageid: this.pageId
      },
      clearSearch: {
        id: 'clear-search-button',
        type: 'click',
        pageid: this.pageId
      },
      home: {
        id: 'tenant-logo',
        type: 'click',
        pageid: this.pageId
      },
      search: {
        id: `search-button`,
        type: 'click',
        pageid: this.pageId
      }
    };
    return interactData[key];
  }
  checkRouter() {
    return _.isEqual(this.router.url, '/');
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
