import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { first, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';

import { OrgDetailsService, FormService, TenantService } from '@sunbird/core';
import { ConfigService, ResourceService, UtilService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { ElectronDialogService } from '../../services';

export interface ILanguage {
  value: string;
  label: string;
  dir: string;
}
@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: [
    './desktop-header.component.scss',
    './desktop-header-menubar.component.scss',
    './desktop-header-search.component.scss'
  ]
})
export class DesktopHeaderComponent implements OnInit {
  appLanguage: ILanguage;
  availableLanguages: ILanguage[];
  public unsubscribe$ = new Subject<void>();

  contentImportInteractEdata: IInteractEventEdata;
  browseEdata: IInteractEventEdata;
  helpCenterEdata: IInteractEventEdata;
  enterDialCodeInteractEdata: IInteractEventEdata;
  takeTourInteractEdata: IInteractEventEdata;
  clearSearchInteractEdata: IInteractEventEdata;
  homeInteractEdata: IInteractEventEdata;
  myLibraryMenuInteractEdata: IInteractEventEdata;

  languageFormQuery = {
    formType: 'content',
    formAction: 'search',
    filterEnv: 'resourcebundle'
  };
  showQrModal = false;
  queryParam: any = {};
  tenantInfo: any = {};

  constructor(
    public router: Router,
    public orgDetailsService: OrgDetailsService,
    private _cacheService: CacheService,
    public configService: ConfigService,
    public formService: FormService,
    public resourceService: ResourceService,
    public electronDialogService: ElectronDialogService,
    public tenantService: TenantService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.orgDetailsService.orgDetails$.pipe(first()).subscribe(data => {
      if (data && !data.err) {
        this.getLanguage(data.orgDetails.hashTagId);
      }
    });

    this.setInteractData();
    this.getTenantInfo();

    this.utilService.searchQuery$.pipe(
      takeUntil(this.unsubscribe$)).subscribe(() => this.clearSearchQuery());
  }

  getTenantInfo() {
    this.tenantService.tenantData$.subscribe(({ tenantData }) => {
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
      this.routeToOffline();
    }
  }

  routeToOffline() {
    if (_.includes(this.router.url, 'browse')) {
      this.router.navigate(['browse', 1], { queryParams: this.queryParam });
    } else {
      this.router.navigate(['search'], { queryParams: this.queryParam });
    }
  }

  getSearchButtonInteractEdata(key) {
    const searchInteractEData = {
      id: `search-button`,
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };

    if (key) {
      searchInteractEData['extra'] = {
        query: key
      };
    }

    return searchInteractEData;
  }

  clearSearchQuery() {
    this.queryParam = {};
  }

  handleImport() {
    this.electronDialogService.showContentImportDialog();
  }

  setInteractData() {
    this.contentImportInteractEdata = {
      id: 'content-import-button',
      type: 'click',
      pageid: 'explore'
    };
    this.myLibraryMenuInteractEdata = {
      id: 'myLibrary-tab',
      type: 'click',
      pageid: 'library'
    };
    this.browseEdata = {
      id: 'browse-tab',
      type: 'click',
      pageid: 'browse'
    };
    this.helpCenterEdata = {
      id: 'help-center-tab',
      type: 'click',
      pageid: 'help-center'
    };
    this.enterDialCodeInteractEdata = {
      id: 'click-dial-code',
      type: 'click',
      pageid: 'explore'
    };
    this.takeTourInteractEdata = {
      id: 'take-tour-button',
      type: 'click',
      pageid: 'explore'
    };
    this.clearSearchInteractEdata = {
      id: 'clear-search-button',
      type: 'click',
      pageid: 'explore'
    };
    this.homeInteractEdata = {
      id: 'tenant-logo',
      type: 'click',
      pageid: 'explore'
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
