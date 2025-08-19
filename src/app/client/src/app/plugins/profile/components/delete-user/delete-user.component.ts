import { Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService, LayoutService, IUserData, ConfigService, CacheService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { UserService, OrgDetailsService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  @ViewChildren('inputFields') inputFields;
  @Output() close = new EventEmitter();
  enableSubmitBtn = false;
  conditions = [];
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  submitCancelInteractEdata: IInteractEventEdata;
  layoutConfiguration: any;
  showContactPopup = false
  list = []
  public unsubscribe = new Subject<void>();
  pageId = 'delete-user';
  userProfile: any;
  deepLink;
  skipOtpVerification = false;
  
  constructor(public resourceService: ResourceService, public toasterService: ToasterService, public router: Router,
    public userService: UserService, public configService: ConfigService, public orgDetailsService: OrgDetailsService,
    private activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    public layoutService: LayoutService, public cacheService: CacheService, public deviceDetectorService: DeviceDetectorService) {
    this.userService.userData$.subscribe((user: IUserData) => {
      this.userProfile = user.userProfile;
    })
  }

  ngOnInit() {
    let obj = this.resourceService.frmelmnts.lbl
    this.list = Object.keys(obj)
      .filter(key => key.includes('condition'))
      .map(key => obj[key]);
    this.navigationhelperService.setNavigationUrl();
    this.setTelemetryData();
    this.checkOtpVerificationSetting();
    if (_.get(this.activatedRoute, 'snapshot.queryParams.deeplink')) {
      this.deepLink =_.get(this.activatedRoute, 'snapshot.queryParams.deeplink')
    } 
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

  goBack() {
    this.navigationhelperService.goBack();
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.pageId,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.router.url,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };

    this.submitInteractEdata = {
      id: 'submit-delete-user',
      type: 'click',
      pageid: this.pageId
    };

    this.submitCancelInteractEdata = {
      id: 'cancel-delete-user',
      type: 'click',
      pageid: this.pageId
    };
  }

  onCancel() {
    this.navigationhelperService.navigateToLastUrl();
  }

  onSubmitForm() {
    if (this.enableSubmitBtn) {
      this.enableSubmitBtn = false;
      
      if (this.skipOtpVerification) {
        this.verificationSuccess();
        return;
      }
      
      this.showContactPopup = true;
      this.conditions = []
      this.inputFields.forEach((element) => {
        element.nativeElement.checked = false;
      });
    }else{
      this.toasterService.warning(this.resourceService.messages.imsg.m0092)
    }
  }

  /**
   * Check system setting for OTP verification on delete
   */
  private checkOtpVerificationSetting() {
    const verifyOtpOnDeleteUrl = _.get(this.configService, 'urlConFig.URLS.SYSTEM_SETTING.VERIFY_OTP_ON_DELETE');
    if (!verifyOtpOnDeleteUrl) {
      this.skipOtpVerification = false;
      return;
    }
    
    const systemSetting = {
      url: verifyOtpOnDeleteUrl,
    };
    
    this.orgDetailsService.learnerService.get(systemSetting).subscribe(response => {
      if (_.get(response, 'result.response.value') === 'false') {
        this.skipOtpVerification = true;
      } else {
        this.skipOtpVerification = false;
      }
    }, error => {
      this.skipOtpVerification = false;
    });
  }

  /**
   * Direct delete without OTP verification
   */
  verificationSuccess() {
    this.userService.deleteUser().subscribe(data => {
        if(_.get(data, 'result.response') === 'SUCCESS'){
          this.toasterService.success("Your account is deleted successfully");
          if(this.deviceDetectorService.isMobile() && this.deepLink !== ''){
            //TODO changes need to be done on the Mobile Deeplink
            const url = this.deepLink+'?userId='+ this.userProfile.userId;
            window.open(url, '_blank');
          }
          window.location.replace('/logoff');
          this.cacheService.removeAll();
        }
      },
      (err) => {
        //TODO we need to update the error 
        const errorMessage =  this.resourceService.messages.fmsg.m0085;
        this.toasterService.error(errorMessage);
      }
    );
  }

  /**
    * This method checks whether the length of comments is greater than zero.
    * If both the validation is passed it enables the submit button
    */
  validateModal() {
    if ((this.inputFields && this.inputFields.length === this.conditions.length)) {
      this.enableSubmitBtn = true;
    } else {
      this.enableSubmitBtn = false;
    }
  }
  
  /**
   * This method pushes all the checked conditions into an array
   */
  createCheckedArray(checkedItem) {
    if (checkedItem && (_.indexOf(this.conditions, checkedItem) === -1)) {
      this.conditions.push(checkedItem);
    } else if (checkedItem && (_.indexOf(this.conditions, checkedItem) !== -1)) {
      this.conditions.splice(_.indexOf(this.conditions, checkedItem), 1);
    }
    this.validateModal();
  }
}
