import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, UtilService, LayoutService, GenericResourceService } from '@sunbird/shared';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss']
})
export class LanguageDropdownComponent implements OnInit {
  @Input() redirectUrl: string;
  @Input() languageRange: Array<any>;
  selectedLanguage: string;
  @Input() layoutConfiguration;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _cacheService: CacheService,
    public resourceService: ResourceService,
    public router: Router,
    public utilService: UtilService,
    public layoutService: LayoutService,
    public genericResourceService: GenericResourceService
  ) { }

  ngOnInit() {
    // check if website select the language else get the cache service lang
    let tenantPageLang = localStorage.getItem('portalLanguage') || this._cacheService.get('portalLanguage');
    if (tenantPageLang) {tenantPageLang=tenantPageLang.replaceAll("\"","")};
    if (tenantPageLang == null) {
      tenantPageLang = 'en';
    }
    // if website has lang then set the lang in cache service
    if (localStorage.getItem('portalLanguage')) {
      this._cacheService.set('portalLanguage', tenantPageLang);
      this.resourceService.initialize();
      this.genericResourceService.initialize();
    } else {
      // If user directly open portal then set lang to storage for website
      localStorage.setItem('portalLanguage', tenantPageLang);
    }
    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';
    this.resourceService.getLanguageChange(_.find(this.languageRange, ['value', this.selectedLanguage]));
    this.genericResourceService.getLanguageChange(_.find(this.languageRange, ['value', this.selectedLanguage]));
    window['TagManager']?.SBTagService?.pushTag({portalLanguage: this.selectedLanguage}, 'USERLANG_', true);
  }

  onLanguageChange(event) {
    this._cacheService.set('portalLanguage', event);
    localStorage.setItem('portalLanguage', event);
    const language = _.find(this.languageRange, ['value', event]);
    window['TagManager']?.SBTagService?.pushTag({portalLanguage: event}, 'USERLANG_', true);
    this.utilService.emitLanguageChangeEvent(language);
    this.resourceService.getResource(event, language);
    this.genericResourceService.getResource(event, language);
  }

  getTelemetryInteractEdata(language): IInteractEventEdata {
    let pageId = this.router.url.split('/')[1];
    if (pageId.indexOf('?selectedTab') > 0) {
      pageId = pageId.split('?')[0];
    }
    return {
      id: `${language}-lang`, type: 'click', pageid: pageId ||
        _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid')
    };
  }
  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }
}
