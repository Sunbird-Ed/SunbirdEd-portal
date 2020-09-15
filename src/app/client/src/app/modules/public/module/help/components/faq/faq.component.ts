import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';

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

  constructor(private http: HttpClient, private _cacheService: CacheService, private utilService: UtilService) {
    this.faqBaseUrl = 'https://ntpstagingall.blob.core.windows.net/public/faq/resources/res';
  }

  ngOnInit() {
    this.selectedLanguage = this._cacheService.get('portalLanguage') || 'en';
    this.getFaqJson();
    this.utilService.languageChange.subscribe((langData) => {
      this.showLoader = true;
      this.selectedLanguage = _.get(langData, 'value') || 'en';
      this.getFaqJson();
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
}
