import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, UtilService, LayoutService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
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
    public layoutService: LayoutService
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
  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }
}
