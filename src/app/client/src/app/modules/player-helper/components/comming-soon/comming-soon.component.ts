import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { OrgDetailsService, UserService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comming-soon',
  templateUrl: './comming-soon.component.html'
})

export class CommingSoonComponent implements OnInit, OnDestroy {
  public showLoader = true;
  public loaderMessage: any;
  public unsubscribe$ = new Subject<void>();
  private selectLanguage: string;
  commingSoonMessage: string;
  contentComingSoonDetails: any;
  /*
  * content's channel value
  */
  @Input() contentOrgId: string;
  resourceDataSubscription: any;
  constructor(public orgDetailsService: OrgDetailsService, private userService: UserService,
    public resourceService: ResourceService) {
  }

  ngOnInit() {
    this.resourceDataSubscription = this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
      this.selectLanguage = item.value;
      this.setCommingSoonMessage();
    });
  }

  public setCommingSoonMessage () {
    /*
    * rootOrgId is required to select the custom comming soon message from systemsettings
    */
    let rootOrgId: string;
    if (this.userService.loggedIn) {
      rootOrgId = this.userService.rootOrgId;
    } else {
      rootOrgId = this.orgDetailsService.getRootOrgId;
    }
    const inputArray = [rootOrgId];
    if (this.contentOrgId) {
      /*
      * push to the top of the array as custom message need to be from content's orgid and fallback to loggedin orgid
      */
      inputArray.unshift(this.contentOrgId);
    }
    this.orgDetailsService.getCommingSoonMessage(inputArray).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (apiResponse) => {
        this.contentComingSoonDetails = apiResponse;
        this.commingSoonMessage = this.getMessageFormTranslations();
        this.showLoader = false;
      }
    );
  }

  private getMessageFormTranslations () {
    let commingSoonMessage = '';
    try {
      const translations = JSON.parse(this.contentComingSoonDetails.translations);
      if (translations[this.selectLanguage]) {
        commingSoonMessage =  translations[this.selectLanguage];
      } else {
        commingSoonMessage = translations['en'];
      }
    } catch (e) {
      commingSoonMessage =  (this.contentComingSoonDetails && this.contentComingSoonDetails.value);
    }
    // default message
    if (!commingSoonMessage) {
      commingSoonMessage = this.resourceService.messages.stmsg.m0122;
    }
    return commingSoonMessage;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
}
