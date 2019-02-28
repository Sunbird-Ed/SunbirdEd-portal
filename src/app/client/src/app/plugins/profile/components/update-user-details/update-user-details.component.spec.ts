import { UpdateUserDetailsComponent } from './update-user-details.component';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './../../services';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { testData } from './update-user-details.component.spec.data';

describe('UpdateUserDetailsComponent', () => {
  let component: UpdateUserDetailsComponent;
  let fixture: ComponentFixture<UpdateUserDetailsComponent>;

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      },
      'stmsg': {
        'm0130': 'We are fetching districts',
      },
      'emsg': {
        'm0016': 'Fetching state failed',
        'm0017': 'Fetching district failed'
      },
      'smsg': {
        'm0046': 'Profile updated successfully'
      }
    },
    'frmelmnts': {
      'lbl': {
        'resentOTP': 'OTP resent'
        }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule.forRoot(), FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [UpdateUserDetailsComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle }, ProfileService, ToasterService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should show validation error message for form', () => {
    component.userProfile = testData.userData;
    spyOn(component, 'getState');
    spyOn(component, 'onStateChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    expect(component.userDetailsForm.valid).toBeTruthy();
    expect(component.onStateChange).toHaveBeenCalled();
    expect(component.getState).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeTruthy();
  });

  it('should show validation error for name', () => {
    component.userProfile = testData.userData;
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'getState');
    spyOn(component, 'onStateChange');
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    const name = component.userDetailsForm.controls['name'];
    name.setValue('@@11');
    expect(name.errors.pattern).toBeTruthy();
  });

  it('should call get state and get success', () => {
    component.userProfile = testData.userData;
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'getState').and.callThrough();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableOf(testData.getStateSuccess));
    component.ngOnInit();
    expect(component.allStates).toEqual(testData.getStateSuccess.result.response);
  });

  it('should call get state and get error', () => {
    component.userProfile = testData.userData;
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'getState').and.callThrough();
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableThrowError(testData.getStateError));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0016);
  });

  it('should call get district and get success', () => {
    component.userProfile = testData.userData;
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'getDistrict').and.callThrough();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableOf(testData.getDistrictSuccess));
    component.ngOnInit();
    expect(component.showDistrictDivLoader).toBeFalsy();
  });

  it('should call get district and get error', () => {
    component.userProfile = testData.userData;
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'getDistrict').and.callThrough();
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(profileService, 'getUserLocation').and.returnValue(observableThrowError(testData.getDistrictError));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0016);
  });
});
