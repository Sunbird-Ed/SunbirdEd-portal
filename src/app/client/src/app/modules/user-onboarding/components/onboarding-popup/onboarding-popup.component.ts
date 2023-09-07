import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DeviceRegisterService, FormService, UserService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';
import { IDeviceProfile } from '../../../shared-feature/interfaces';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { onboardingScreenType } from '../../components/onboarding-popup/onboarding-popup.component.models'

@Component({
  selector: 'app-onboarding-popup',
  templateUrl: './onboarding-popup.component.html',
  styleUrls: ['./onboarding-popup.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class OnboardingPopupComponent implements OnInit {
  @Input() deviceProfile: IDeviceProfile;
  @Input() guestUserDetails;
  @Input() isGuestUser;
  @Output() close = new EventEmitter<any>();
  @Output() isStepperCompleted = new EventEmitter<any>();
  @Input() OnboardingFormConfig;
  public unsubscribe$ = new Subject<void>();
  public onBoardingPopup = 'onboarding-popup';
  isEditable: boolean = true;
  guestUserStoredData;
  userTypeStoredData;
  tenantInfo: ITenantData;
  isSkipped: boolean = true;
  onboardingFilterData;
  isPreview = true;
  @ViewChild('stepper') stepper: MatStepper;
  get onboardingScreenType() { return onboardingScreenType; }
  constructor(
    public sanitizer: DomSanitizer,
    public deviceRegisterService: DeviceRegisterService,
    public formService: FormService,
    public resourceService: ResourceService,
    public userService: UserService

  ) { }
  ngOnInit() {
    this.guestUserStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    this.getOnboardingFormConfig(false, false, false);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @param  {MatStepper} stepper - stepper event 
   * @description -   navigate to the next stepper when the submit event is emitted from  the userType screen.
   */
  userTypeSubmit(stepper: MatStepper) {
    this.userTypeStoredData = localStorage.getItem('guestUserType');
    this.isSkipped = false;
    if (this.onboardingFilterData.length === 1) {
      this.isStepperCompleted.emit(true);
    } else {
      stepper.next();
    }
  }

  /**
   * @param  {MatStepper} stepper - stepper event 
   * @description -  locationSubmit 
   * navigate to the next stepper when the submit event is emitted from  the location screen.
   * call the getLocation function to get the location details to display on preview page
   */
  locationSubmit(stepper: MatStepper) { // location form submit
    this.guestUserStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    this.isSkipped = false;
    this.getLocation();
    if (this.onboardingFilterData.length === 1) {
      this.isStepperCompleted.emit(true);
    } else {
      stepper.next();
    }
  }

  /**
  * @description -  to get the device profile details
  */
  getLocation() {
    this.deviceRegisterService.fetchDeviceProfile().pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      this.deviceProfile = _.get(response, 'result');
    });
  }

  /**
   * @param  {MatStepper} stepper - stepper event 
   * @description -  navigate to the next stepper when the submit event is emitted from  the BMGS screen.
   */
  public updateFrameWork(stepper: MatStepper) {
    this.guestUserStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    this.isSkipped = false;
    if (this.onboardingFilterData.length === 1) {
      this.isStepperCompleted.emit(true);
    } else {
      stepper.next();
    }
  }

  /**
   * @param  {Boolean} isBMGSkipped - Flag to indicate BMGS section
   * @param  {Boolean} isUserTypeSkipped - Flag to indicate userType section
   * @param  {Boolean} isLocationSkipped - Flag to indicate Location section
   * @description -  function to validate form config if disabled & having default value. it will update the api based on default
   * if all are disabled it wont show the popup
   */
  getOnboardingFormConfig(isBMGSkipped, isUserTypeSkipped, isLocationSkipped) { // condition for form config
    _.map(this.OnboardingFormConfig, (formConfigRes) => {
      if (_.get(formConfigRes, 'renderOptions.name') === onboardingScreenType.BMGS && ((_.get(formConfigRes, 'isEnabled') === false && _.get(formConfigRes, 'defaults')) || (isBMGSkipped && _.get(formConfigRes, 'defaults')))) {
        this.updateGuestUser(_.get(formConfigRes, 'defaults'));
      } else if (_.get(formConfigRes, 'renderOptions.name') === onboardingScreenType.USERTYPE && ((_.get(formConfigRes, 'isEnabled') === false && _.get(formConfigRes, 'defaults.role')) || (isUserTypeSkipped && _.get(formConfigRes, 'defaults.role')))) {
        localStorage.setItem('guestUserType', _.get(formConfigRes, 'defaults.role'));
        this.userTypeStoredData = localStorage.getItem('guestUserType')
      } else if (_.get(formConfigRes, 'renderOptions.name') === onboardingScreenType.LOCATION && ((_.get(formConfigRes, 'isEnabled') === false && _.get(formConfigRes, 'defaults')) || (isLocationSkipped && _.get(formConfigRes, 'defaults')))) {
        this.deviceRegisterService.updateDeviceProfile(_.get(formConfigRes, 'defaults')).subscribe();
      }
      this.isAllScreenDisabled();
    });
  }

  /**
   * @param  {object} defaultVal -   API request object
   * @description - update the guestUser Service with default value
   */
  updateGuestUser(defaultVal) {
    const user: any = { name: 'guest', formatedName: 'Guest', framework: defaultVal };
    const userType = localStorage.getItem('userType');
    if (userType) {
      user.role = userType;
    }
    this.userService.createGuestUser(user).subscribe();
  }

  /**
   * @description - function to check weather all the fileds are disabled
   * emit a event to parent to disbale the stepepr popup if true
   * preview screen will be disable if only one scrren is enabled in stepper
   */
  isAllScreenDisabled() {
    this.onboardingFilterData = _.filter(this.OnboardingFormConfig, (res) => res.isEnabled === true);
    if (this.onboardingFilterData.length === 0) {
      this.isPreview = false;
      this.isStepperCompleted.emit(true);
    }
    if (this.onboardingFilterData.length === 1) {
      this.isPreview = false;
    }
  }

  /**
  * @description - close the stepper popup when the user completes the process
  */
  onProcessComplete() {
    const userType = localStorage.getItem('guestUserType');
    if (!this.guestUserStoredData) {
      this.getOnboardingFormConfig(true, false, false);
    }
    if (!userType) {
      this.getOnboardingFormConfig(false, true, false);
    }
    if (!this.deviceProfile) {
      this.getOnboardingFormConfig(false, false, true);
    }
    this.isStepperCompleted.emit(true);
  }

  /**
   * @param  {string} url  - Raw url
   * @description - url to be sanitized to display in iframe
   */
  getSanitizedURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * @description - it will return a flag if all the steps are skipped
   */
  onClickNext() {
    if (this.onboardingFilterData.length === 1) {
      this.onProcessComplete();
    }
  }
}