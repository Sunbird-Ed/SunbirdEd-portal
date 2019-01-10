import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SignupService } from './../../services';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'signup', pageid: 'signup', uri: '/signup',
        type: 'view', mode: 'self', uuid: 'hadfisgefkjsdvv'
      }
    }
  }
};

describe('SignUpComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), RecaptchaModule, CoreModule.forRoot(),
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [ SignupComponent ],
      providers: [FormBuilder, ResourceService, SignupService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  it('should show validation error message for form', () => {
    component.signUpForm = undefined;
    spyOn(component, 'onContactTypeValueChanges');
    spyOn(component, 'enableSignUpSubmitButton');
    spyOn(component, 'onPhoneChange');
    component.ngOnInit();
    expect(component.signUpForm.valid).toBeFalsy();
    expect(component.onContactTypeValueChanges).toHaveBeenCalled();
    expect(component.enableSignUpSubmitButton).toHaveBeenCalled();
    expect(component.onPhoneChange).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBeTruthy();
  });
  it('should show validation error message for name', () => {
    spyOn(component, 'onContactTypeValueChanges');
    spyOn(component, 'enableSignUpSubmitButton');
    spyOn(component, 'onPhoneChange');
    component.ngOnInit();
    let errors = {};
    const name = component.signUpForm.controls['name'];
    name.setValue('');
    errors = name.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.onContactTypeValueChanges).toHaveBeenCalled();
    expect(component.enableSignUpSubmitButton).toHaveBeenCalled();
    expect(component.onPhoneChange).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBeTruthy();
  });
  it('should show validation error message for phone', () => {
    spyOn(component, 'onContactTypeValueChanges');
    spyOn(component, 'enableSignUpSubmitButton');
    spyOn(component, 'onPhoneChange');
    component.ngOnInit();
    let errors = {};
    const phone = component.signUpForm.controls['phone'];
    phone.setValue('');
    errors = phone.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.onContactTypeValueChanges).toHaveBeenCalled();
    expect(component.enableSignUpSubmitButton).toHaveBeenCalled();
    expect(component.onPhoneChange).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBeTruthy();
  });
  it('should show pattern match error message for phone', () => {
    spyOn(component, 'onContactTypeValueChanges');
    spyOn(component, 'enableSignUpSubmitButton');
    spyOn(component, 'onPhoneChange');
    component.ngOnInit();
    let errors = {};
    const phone = component.signUpForm.controls['phone'];
    phone.setValue('8989');
    errors = phone.errors || {};
    expect(errors['pattern']).toBeTruthy();
    expect(component.onContactTypeValueChanges).toHaveBeenCalled();
    expect(component.enableSignUpSubmitButton).toHaveBeenCalled();
    expect(component.onPhoneChange).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBeTruthy();
  });
  it('should show required validation error message for password', () => {
    component.ngOnInit();
    let errors = {};
    const password = component.signUpForm.controls['password'];
    password.setValue('');
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(password.valid).toBeFalsy();
    expect(password.touched).toBeFalsy();
    expect(component.disableSubmitBtn).toBeTruthy();
  });
  it('should call onEmailChange method', () => {
    spyOn(component, 'onEmailChange');
     spyOn(component, 'enableSignUpSubmitButton');
    component.ngOnInit();
    const contactType = component.signUpForm.controls['contactType'];
    contactType.setValue('email');
     expect(component.onEmailChange).toHaveBeenCalled();
     expect(component.disableSubmitBtn).toBeTruthy();
     expect(component.enableSignUpSubmitButton).toHaveBeenCalled();
  });
  it('set all values with enabling the submit button ', () => {
    component.ngOnInit();
    const name = component.signUpForm.controls['name'];
    name.setValue('sourav');
    const password = component.signUpForm.controls['password'];
    password.setValue('password');
    const confirmPassword = component.signUpForm.controls['confirmPassword'];
    confirmPassword.setValue('password');
    const email = component.signUpForm.controls['email'];
    email.setValue('abc@gmail.com');
    const contactType = component.signUpForm.controls['contactType'];
    contactType.setValue('email');
    const uniqueContact = component.signUpForm.controls['uniqueContact'];
    uniqueContact.setValue(true);
     expect(component.disableSubmitBtn).toBeFalsy();
  });
  it('should call displayPassword method to show password', () => {
    component.displayPassword();
    expect(component.showPassword).toBeTruthy();  });
  it('should call displayPassword method to hide password', () => {
    component.showPassword = true;
    component.displayPassword();
     expect(component.showPassword).toBeFalsy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
