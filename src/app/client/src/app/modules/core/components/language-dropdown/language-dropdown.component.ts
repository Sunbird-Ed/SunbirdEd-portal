
import { takeUntil, first } from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService, FrameworkService, OrgDetailsService, UserService } from './../../services';
import { ConfigService, ResourceService, ToasterService, ServerResponse, Framework} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash';
import { Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html'
})
export class LanguageDropdownComponent implements OnInit, OnDestroy {
  @Input() redirectUrl: string;
  languages: any;
  orgDetailsUnsubscribe: Subscription;
  selectedLanguage: string;
  queryParam: any;
  channelId: any;
  public isCachedDataExists: boolean;
  formType = 'content';
  formAction = 'search';
  filterEnv = 'resourcebundle';
  public unsubscribe = new Subject<void>();

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
    public orgDetailsService: OrgDetailsService,
    public formService: FormService, public toasterService: ToasterService,
    private _cacheService: CacheService, public frameworkService: FrameworkService,
    public configService: ConfigService, public resourceService: ResourceService,   public userService: UserService) { }

  ngOnInit() {
    this.getChannelId();
   this.isCachedDataExists = this._cacheService.exists('portalLanguage');
   if (this.isCachedDataExists) {
     const data: any | null = this._cacheService.get('portalLanguage');
     this.selectedLanguage = data;
     this.resourceService.getResource(this.selectedLanguage);
   } else {
    this.selectedLanguage = 'en';
   }
  }

  getChannelId() {
    if (this.userService.loggedIn) {
      this.userService.userData$.pipe(first()).subscribe((user) => {
        if (user && !user.err ) {
        this.channelId = this.userService.channel,
        this.getLanguage();
        }
      });
    } else {
      this.orgDetailsUnsubscribe = this.orgDetailsService.orgDetails$.subscribe(((data) => {
        if (data && !data.err) {
          this.channelId = data.orgDetails.hashTagId;
          this.getLanguage();
        }
      }));
    }
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
      this.formService.getFormConfig(formServiceInputParams, this.channelId).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (data: ServerResponse) => {
            this.languages = data[0].range;
            this._cacheService.set(this.filterEnv + this.formAction, data,
              {
                maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
                  this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
              });
            this.onLanguageChange('en');
          },
          (err: ServerResponse) => {
            this.languages = [{ 'value': 'en', 'label': 'English', 'dir': 'ltr' }];
            this.onLanguageChange('en');
          }
        );
    }
  }

  onLanguageChange(event) {
   this._cacheService.set('portalLanguage' , event);
    this.resourceService.getResource(event);
    const language = _.find(this.languages, ['value', event]);
    this.resourceService.getLanguageChange(language);
  }

  ngOnDestroy() {
    if (this.orgDetailsUnsubscribe) {
      this.orgDetailsUnsubscribe.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
