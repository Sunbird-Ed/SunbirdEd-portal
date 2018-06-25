import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService, FrameworkService, OrgDetailsService } from './../../services';
import { ConfigService, ResourceService, ToasterService, ServerResponse, Framework } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.css']
})
export class LanguageDropdownComponent implements OnInit {
  @Input() redirectUrl: string;
  languages: any;
  selectedLanguage: string;
  queryParam: any;
  slug: string;
  channelId: any;
  public isCachedDataExists: boolean;
  formType = 'content';
  formAction = 'search';
  filterEnv = 'resourcebundle';

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
    public orgDetailsService: OrgDetailsService,
    public formService: FormService, public toasterService: ToasterService,
    private _cacheService: CacheService, public frameworkService: FrameworkService,
    public configService: ConfigService, public resourceService: ResourceService) { }

  ngOnInit() {
    this.slug = this.activatedRoute.snapshot.params.slug;
    this.getChannelId();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.selectedLanguage = this.queryParam['language'] || 'en';
    });
  }

  getChannelId() {
    this.orgDetailsService.getOrgDetails(this.slug).subscribe(
      (apiResponse: any) => {
        this.channelId = apiResponse.hashTagId;
        this.getLanguage();
      },
    );
  }

  getLanguage() {
    this.isCachedDataExists = this._cacheService.exists(this.filterEnv + this.formAction);
    if (this.isCachedDataExists) {
      const data: any | null = this._cacheService.get(this.filterEnv + this.formAction);
      this.languages = data[0].range;
    } else {
      const formServiceInputParams = {
        formType: this.formType,
        formAction: this.formAction,
        contentType: this.filterEnv,
        framework: ''
      };
      this.formService.getFormConfig(formServiceInputParams, this.channelId).subscribe(
        (data: ServerResponse) => {
          this.languages = data[0].range;
          this._cacheService.set(this.filterEnv + this.formAction, data,
            {
              maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
              this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
            });
        },
        (err: ServerResponse) => {
          this.languages = [{ 'value': 'en', 'name': 'English' }];
          this.onLanguageChange('en');
        }
      );
    }
  }

  onLanguageChange(event) {
    this.queryParam['language'] = event;
    this.router.navigate([this.redirectUrl], {
      queryParams: this.queryParam
    });
  }
}
