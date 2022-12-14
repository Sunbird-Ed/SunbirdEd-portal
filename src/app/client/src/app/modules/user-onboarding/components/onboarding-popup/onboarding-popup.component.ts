import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DeviceRegisterService,FormService } from '@sunbird/core';
import {ResourceService}  from '@sunbird/shared';
import * as _ from 'lodash-es';
import {  Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';
import { IDeviceProfile } from '../../../shared-feature/interfaces';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {onboardingScreenType} from '../../components/onboarding-popup/onboarding-popup.component.models'

@Component({
  selector: 'app-onboarding-popup',
  templateUrl: './onboarding-popup.component.html',
  styleUrls: ['./onboarding-popup.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
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
  isSkipped: boolean = false;
  @ViewChild('stepper') stepper: MatStepper;
  get onboardingScreenType() { return onboardingScreenType; }

  constructor(
    public sanitizer: DomSanitizer,
    public deviceRegisterService: DeviceRegisterService,
    public formService:FormService,
    public resourceService: ResourceService

  ) { }

  ngOnInit() {
    this.guestUserStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    this.getOnboardingFormConfig(false,false,false); // to check the form config valdation
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  
  userTypeSubmit(stepper: MatStepper) { // userType from submit
    this.userTypeStoredData = localStorage.getItem('guestUserType');
    this.isSkipped = false;
    stepper.next(); // moved to next steps
  }

  locationSubmit(stepper: MatStepper) { // location form submit
    this.guestUserStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    this.isSkipped = false;
    this.getLocation();
    stepper.next(); // moved to the next steps
  }
  getLocation() {
    this.deviceRegisterService.fetchDeviceProfile().pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      this.deviceProfile = _.get(response, 'result');
    });
  }

  public updateFrameWork(stepper?: MatStepper) { // BMGS form submit
    this.guestUserStoredData = JSON.parse(localStorage.getItem('guestUserDetails'));
    this.isSkipped = false;
    if(stepper) { stepper.next(); } // moved to next steps
   

  }
  getOnboardingFormConfig(isBMGSkipped,isUserTypeSkipped, isLocationSkipped) { // condition for form config
     _.map(this.OnboardingFormConfig,(formConfigRes) => {
      if(_.get(formConfigRes, 'renderOptions.type.component') === 'BMGS' && ((_.get(formConfigRes, 'isEnabled') === false && _.get(formConfigRes, 'defaults')) || (isBMGSkipped &&  _.get(formConfigRes, 'defaults')))) {
        this.updateFrameWork( _.get(formConfigRes, 'defaults'));
      }
      else if(_.get(formConfigRes, 'renderOptions.type.component') === 'UserType' && ((_.get(formConfigRes, 'isEnabled') === false && _.get(formConfigRes, 'defaults.role')) || (isUserTypeSkipped &&  _.get(formConfigRes, 'defaults.role')))) {
        localStorage.setItem('guestUserType',  _.get(formConfigRes, 'defaults.role'));
        this.userTypeStoredData = localStorage.getItem('guestUserType')
      }
     else if(_.get(formConfigRes, 'renderOptions.type.component') === 'Location' && ((_.get(formConfigRes, 'isEnabled') === false && _.get(formConfigRes, 'defaults')) || (isLocationSkipped &&  _.get(formConfigRes, 'defaults')))) {
        this.deviceRegisterService.updateDeviceProfile(_.get(formConfigRes, 'defaults')).subscribe();
      }
    this.isAllScreenDisabled(); // to check weather all the fileds are disabled
    });
    
  }

  isAllScreenDisabled() {   // to check weather all the fileds are disabled
    if (_.filter(this.OnboardingFormConfig,(res) => res.isEnabled === true).length === 0) {
      this.isStepperCompleted.emit(true);
    }
  }
  onProcessComplete() {
    const userType = localStorage.getItem('guestUserType');
    if(!this.guestUserStoredData) {
       this.getOnboardingFormConfig(true,false,false);
    }
    if(!userType) {
      this.getOnboardingFormConfig(false,true,false);
    }
    if(!this.deviceProfile) {
      this.getOnboardingFormConfig(false,false,true);
    }
    this.isStepperCompleted.emit(true); // to complete the onboarding process 
  }

  getSanitizedURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isStepSkipped() {
    const userType = localStorage.getItem('guestUserType');
    if((this.guestUserStoredData || userType || this.deviceProfile )) {
      this.isSkipped = false;
    }
    else {
      this.isSkipped = true;
    }
  }

}