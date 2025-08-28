import { Component, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService, LayoutService, IUserData, ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { OrgDetailsService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-anonymous-delete-user',
  templateUrl: './anonymous-delete-user.component.html',
  styleUrls: ['./anonymous-delete-user.component.scss']
})
export class AnonymousDeleteUserComponent implements OnInit {

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
  pageId = 'anonymous-delete-user';
  userProfile: any;
  deepLink = '';
  userId = '';
  contactType = '';
  contactValue = '';
  showDelete = true
  skipOtpVerification = false;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService, public router: Router,
    private activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    public layoutService: LayoutService, public configService: ConfigService, public orgDetailsService: OrgDetailsService,
    public deviceDetectorService: DeviceDetectorService) {
  }

  ngOnInit() {
    let obj = this.resourceService.frmelmnts.lbl
    this.list = Object.keys(obj)
      .filter(key => key.includes('condition'))
      .map(key => obj[key]);
    this.navigationhelperService.setNavigationUrl();
    this.setTelemetryData();
    this.checkOtpVerificationSetting();
    const snapshotQueryParams = _.get(this.activatedRoute, 'snapshot.queryParams', {});
    this.deepLink = snapshotQueryParams.deeplink
    this.userId = snapshotQueryParams.userId
    this.contactType = snapshotQueryParams.type
    this.contactValue = snapshotQueryParams.value

    if (!this.deepLink || !this.userId || !this.contactType || !this.contactValue) {
      this.showDelete = false
    } else {
      this.showDelete = true
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
      id: 'submit-anonymous-delete-user',
      type: 'click',
      pageid: this.pageId
    };

    this.submitCancelInteractEdata = {
      id: 'cancel-anonymous-delete-user',
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
        this.verificationSuccess(null);
        return;
      }
      
      this.showContactPopup = true;
      this.conditions = []
      this.inputFields.forEach((element) => {
        element.nativeElement.checked = false;
      });
    } else {
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

  verificationSuccess(data) {
    if (this.deviceDetectorService.isMobile() && this.deepLink !== '') {
      const url = this.deepLink + '?userId=' + this.userId;
      window.open(url, '_blank');
    }
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
