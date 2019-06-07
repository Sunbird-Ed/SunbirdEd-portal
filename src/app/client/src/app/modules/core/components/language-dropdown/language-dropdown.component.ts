import { Router } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html'
})
export class LanguageDropdownComponent implements OnInit {
  @Input() redirectUrl: string;
  @Input() languageRange: Array<any>;
  selectedLanguage: string;

  constructor(private _cacheService: CacheService, public resourceService: ResourceService, public router: Router) {
  }

  ngOnInit() {
    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';
    this.resourceService.getLanguageChange(_.find(this.languageRange, ['value', this.selectedLanguage]));
  }

  onLanguageChange(event) {
    this._cacheService.set('portalLanguage', event);
    const language = _.find(this.languageRange, ['value', event]);
    this.resourceService.getResource(event, language);
  }
  getTelemetryInteractEdata(language): IInteractEventEdata {
    return {id : `${language}-lang`, type: 'click' , pageid: this.router.url.split('/')[1]};
  }

}
