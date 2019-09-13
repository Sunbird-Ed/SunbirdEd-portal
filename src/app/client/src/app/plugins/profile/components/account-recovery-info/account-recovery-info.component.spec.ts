import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountRecoveryInfoComponent } from './account-recovery-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './../../services';

import { throwError as observableThrowError, of as observableOf } from 'rxjs';




describe('AccountRecoveryInfoComponent', () => {
  let component: AccountRecoveryInfoComponent;
  let fixture: ComponentFixture<AccountRecoveryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot() , RouterTestingModule],
      declarations: [AccountRecoveryInfoComponent],
      providers: [ResourceService, ProfileService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRecoveryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should select email id radio button by default and call initialize initializeFormFields() ', () => {
    spyOn(component, 'initializeFormFields').and.callThrough();
    component.ngOnInit();
    expect(component.contactType).toBe('emailId');
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('initializeFormFields if emailId radio is selected', () => {
    component.contactType = 'emailId';
    spyOn(component, 'handleSubmitButton').and.callThrough();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.initializeFormFields();
    expect(component.handleSubmitButton).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('initializeFormFields if phone no. radio is selected', () => {
    component.contactType = 'phoneNo';
    spyOn(component, 'handleSubmitButton').and.callThrough();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.initializeFormFields();
    expect(component.handleSubmitButton).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should shoudl call initializeFormFields() whenever different radio button is selected', () => {
    spyOn(component, 'initializeFormFields').and.callThrough();
    component.onItemChange();
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should add/update email id for account recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'emailId';
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf({}));
    component.updateRecoveryId();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should add/update phone no. for account recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'phoneNo';
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf({}));
    component.onItemChange();
    component.updateRecoveryId();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
