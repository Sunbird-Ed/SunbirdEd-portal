import { Component, Inject, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Consent, ConsentStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { TncService, UserService, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ServerResponse, ToasterService, UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopupControlService } from '../../../../service/popup-control.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-global-consent-pii',
  templateUrl: './global-consent-pii.component.html',
  styleUrls: ['./global-consent-pii.component.scss']
})
export class GlobalConsentPiiComponent implements OnInit {

  @Input() collection;
  @Input() type;
  @Input() showConsentPopup;
  @Input() consentConfig;
  @Input() isglobalConsent;
  @ViewChild('profileDetailsModal') profileDetailsModal;
  @Output() close = new EventEmitter<any>();
  consentPii = 'Yes';
  isDataShareOn = false;
  lastUpdatedOn = '';
  userInformation = [];
  editSetting = false;
  isTncAgreed = false;
  // showConsentPopup = false;
  showTncPopup = false;
  termsAndConditionLink: string;
  unsubscribe = new Subject<void>();
  private usersProfile: any;
  showSettingsPage: boolean;
  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    private toasterService: ToasterService,
    public userService: UserService,
    public resourceService: ResourceService,
    public tncService: TncService,
    public utilService: UtilService,
    public popupControlService: PopupControlService,
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router,
    public generaliseLabelService: GeneraliseLabelService
  ) { }

  ngOnInit() {
    this.usersProfile = _.cloneDeep(this.userService.userProfile);
    this.getUserInformation();
    this.getUserConsent();
    if (this.isglobalConsent) {
      this.showSettingsPage = false;
    } else {
      this.showSettingsPage = true;
    }
    this.checkQueryParams();

    this.coursesService.revokeConsent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.updateUserConsent(false);
      });
  }

  checkQueryParams() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(response => {
        if (response.consent) {
          this.showConsentPopup = true;
          this.removeQueryParam();
        }
      });
  }

  getUserInformation() {
    this.userInformation['name'] = this.usersProfile.lastName ?
     `${this.usersProfile.firstName} ${this.usersProfile.lastName}` : this.usersProfile.firstName;
    this.userInformation['userid'] = this.usersProfile.userId;
    this.userInformation['emailId'] = this.usersProfile.email;
    this.userInformation['phone'] = this.usersProfile.phone;

    if (_.get(this.usersProfile, 'userLocations.length')) {
      this.usersProfile.userLocations.forEach(locDetail => {
        switch (locDetail.type) {
          case 'state':
            this.userInformation['state'] = locDetail.name;
            break;
          case 'district':
            this.userInformation['district'] = locDetail.name;
            break;
          case 'block':
            this.userInformation['block'] = locDetail.name;
            break;
        }
      });
    }

    if (_.get(this.usersProfile, 'declarations.length')) {
      for (const [key, value] of Object.entries(this.usersProfile.declarations[0].info)) {
        switch (key) {
          case 'declared-email':
            this.userInformation['emailId'] = value;
            break;
          case 'declared-phone':
            this.userInformation['phone'] = value;
            break;
          case 'declared-school-udise-code':
            this.userInformation['schoolId'] = value;
            break;
          case 'declared-school-name':
            this.userInformation['schoolName'] = value;
            break;
        }
      }
    }
  }

  fetchTncData() {
    this.tncService.getTncConfig().pipe(takeUntil(this.unsubscribe)).subscribe((data: ServerResponse) => {
      const response = _.get(data, 'result.response.value');
      if (response) {
        try {
          const tncConfig = this.utilService.parseJson(response);
          const version = _.get(tncConfig, 'latestVersion') || {};
          this.termsAndConditionLink = tncConfig[version].url;
        } catch (e) {
          this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
        }
      }
    }, () => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    }
    );
  }

  saveConsent() {
    const isActive = _.upperCase(this.consentPii) === 'YES';

    if (isActive) {
      this.showConsentPopup = true;
    } else {
      this.updateUserConsent(isActive);
    }

    this.toggleEditSetting();
  }

  toggleEditSetting() {
    this.editSetting = !this.editSetting;
  }

  showAndHidePopup(mode: boolean) {
    this.showTncPopup = mode;
    this.close.emit();
    this.popupControlService.changePopupStatus(true);
  }

  getUserConsent() {
    const request = {
      userId: this.userService.userid,
      consumerId: '',
      objectId: ''
    };
    if (this.type === 'course-consent') {
      request.consumerId = this.collection ? this.collection.channel : '';
      request.objectId = this.collection ? this.collection.identifier : '';
    } else if ( this.type === 'global-consent') {
      request.consumerId = this.userService.channel;
      request.objectId = this.userService.channel;
    }
    this.csUserService.getConsent(request, { apiPath: '/learner/user/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        if (this.type === 'global-consent') {
          this.showConsentPopup = false;
          this.type = '';
          this.isglobalConsent = false;
        }
        this.isDataShareOn = _.get(res, 'consents[0].status') === ConsentStatus.ACTIVE;
        this.consentPii = this.isDataShareOn ? 'No' : 'Yes';
        this.lastUpdatedOn = _.get(res, 'consents[0].lastUpdatedOn') || '';
      }, error => {
        console.error('error', error);
        if (error.code === 'HTTP_CLIENT_ERROR' && _.get(error, 'response.responseCode') === 404) {
          this.showConsentPopup = true;
        } else {
          this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
        }
      });
  }

  updateUserConsent(isActive: boolean) {
    this.showConsentPopup = false;
    const request: Consent = {
      status: isActive ? ConsentStatus.ACTIVE : ConsentStatus.REVOKED,
      userId: this.userService.userid,
      consumerId: '',
      objectId: '',
      objectType: ''
    };
    if (this.type === 'course-consent') {
      request.consumerId = this.collection ? this.collection.channel : '';
      request.objectId = this.collection ? this.collection.identifier : '';
      request.objectType = 'Collection';
    } else if ( this.type === 'global-consent') {
      request.consumerId = this.userService.channel;
      request.objectId = this.userService.channel;
      request.objectType = 'global';
    }
    this.csUserService.updateConsent(request, { apiPath: '/learner/user/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.toasterService.success(_.get(this.resourceService, 'messages.smsg.dataSettingSubmitted'));
        this.getUserConsent();
        this.close.emit();
        this.popupControlService.changePopupStatus(true);
      }, error => {
        this.isTncAgreed = false;
        this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0005'));
        console.error('Error while updating user consent', error);
      });
  }

  removeQueryParam() {
    this.router.navigate([], {
      queryParams: { 'consent': null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (_.get(this.profileDetailsModal, 'deny')) {
      this.profileDetailsModal.deny();
    }
  }

}
