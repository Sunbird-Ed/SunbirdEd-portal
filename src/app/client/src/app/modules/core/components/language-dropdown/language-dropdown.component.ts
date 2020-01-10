import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, UtilService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { environment } from '@sunbird/environment';


@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html'
})
export class LanguageDropdownComponent implements OnInit {
  @Input() redirectUrl: string;
  @Input() languageRange: Array<any>;
  selectedLanguage: string;
  isOffline: boolean = environment.isOffline;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _cacheService: CacheService,
    public resourceService: ResourceService,
    public router: Router,
    public utilService: UtilService
  ) { }

  ngOnInit() {
    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';
    this.resourceService.getLanguageChange(_.find(this.languageRange, ['value', this.selectedLanguage]));
  }

  onLanguageChange(event) {
    this._cacheService.set('portalLanguage', event);
    const language = _.find(this.languageRange, ['value', event]);
    this.utilService.emitLanguageChangeEvent(language);
    this.resourceService.getResource(event, language);
  }

  getTelemetryInteractEdata(language): IInteractEventEdata {
    return {
      id: `${language}-lang`, type: 'click', pageid: this.router.url.split('/')[1] ||
        _.get(this.activatedRoute, 'root.firstChild.snapshot.data.telemetry.pageid')
    };
  }
}
