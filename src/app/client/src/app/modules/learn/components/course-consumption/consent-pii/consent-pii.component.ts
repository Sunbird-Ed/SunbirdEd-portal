import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Consent, ConsentStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { TncService, UserService, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ServerResponse, ToasterService, UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-consent-pii',
  templateUrl: './consent-pii.component.html',
  styleUrls: ['./consent-pii.component.scss']
})
export class ConsentPiiComponent implements OnInit {

  @Input() collection;
  @ViewChild('profileDetailsModal') profileDetailsModal;
  consentPii = 'Yes';
  isDataShareOn = false;
  lastUpdatedOn = '';
  userInformation = [];
  editSetting = false;
  isTncAgreed = false;
  showConsentPopup = false;
  showTncPopup = false;
  termsAndConditionLink: string;
  unsubscribe = new Subject<void>();
  private usersProfile: any;
  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    private toasterService: ToasterService,
    public userService: UserService,
    public resourceService: ResourceService,
    public tncService: TncService,
    public utilService: UtilService,
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router,
    public generaliseLabelService: GeneraliseLabelService
  ) { }

  ngOnInit() {
    this.usersProfile = _.cloneDeep(this.userService.userProfile);
    this.getUserInformation();
    this.getUserConsent();
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
    this.userInformation['name'] = this.usersProfile.lastName ? `${this.usersProfile.firstName} ${this.usersProfile.lastName}` : this.usersProfile.firstName;
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
  }

  getUserConsent() {
    const request = {
      userId: this.userService.userid,
      consumerId: this.collection.channel,
      objectId: this.collection.identifier
    };
    this.csUserService.getConsent(request, { apiPath: '/learner/user/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
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
      consumerId: this.collection.channel,
      objectId: this.collection.identifier,
      objectType: 'Collection'
    };
    this.csUserService.updateConsent(request, { apiPath: '/learner/user/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.toasterService.success(_.get(this.resourceService, 'messages.smsg.dataSettingSubmitted'));
        this.getUserConsent();
        this.isTncAgreed = false;
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
