import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SignupService } from './../../services';
import { CoreModule, TenantService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {of as observableOf, of, throwError as observableThrowError} from 'rxjs';

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

const resourceBundle = {
  'frmelmnts': {
    'instn': {
      't0015': 'Upload Organization',
      't0016': 'Upload User'
    },
    'lbl': {
      'chkuploadsts': 'Check Status',
      'passwd': 'Password must contain a minimum of 8 characters including numerals, '
      + 'lower and upper case alphabets and special characters.',
      'uniquePhone': 'uniquePhone'
    },
  },
  'messages': {
    'smsg': {},
    'fmsg': {
      'm0001': 'api failed, please try again',
      'm0004': 'api failed, please try again'
    }
  },
  languageSelected$: of({value: ''}),
  getResource() { }
};

describe('SignUpComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), RecaptchaModule, CoreModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [ SignupComponent ],
      providers: [FormBuilder, ResourceService, SignupService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle },
        {provide : TenantService, useValue: { tenantData$: of('')}}],
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
  it('should show required lowercase validation error message for password', fakeAsync(() => {
    spyOn(component, 'onPasswordChange').and.callThrough();
    component.initializeFormFields();
    let errors = {};
    const password = component.signUpForm.controls['password'];
    password.setValue('UG');
    tick(200);
    errors = password.errors || {};
    expect(component.onPasswordChange).toHaveBeenCalled();
    expect(password.errors.passwordError).toEqual('Password must contain a minimum of 8 characters including numerals, '
    + 'lower and upper case alphabets and special characters.');
  }));
  it('should show required uppercase validation error message for password', fakeAsync(() => {
    spyOn(component, 'onPasswordChange').and.callThrough();
    component.initializeFormFields();
    let errors = {};
    const password = component.signUpForm.controls['password'];
    password.setValue('a');
    tick(200);
    errors = password.errors || {};
    expect(component.onPasswordChange).toHaveBeenCalled();
    expect(password.errors.passwordError).toEqual('Password must contain a minimum of 8 characters including numerals, '
    + 'lower and upper case alphabets and special characters.');
  }));
  it('should show required digit validation error message for password', fakeAsync(() => {
    spyOn(component, 'onPasswordChange').and.callThrough();
    component.initializeFormFields();
    let errors = {};
    const password = component.signUpForm.controls['password'];
    password.setValue('aA');
    tick(200);
    errors = password.errors || {};
    expect(component.onPasswordChange).toHaveBeenCalled();
    expect(password.errors.passwordError).toEqual('Password must contain a minimum of 8 characters including numerals, '
    + 'lower and upper case alphabets and special characters.');
  }));
  it('should show required special character validation error message for password', fakeAsync(() => {
    spyOn(component, 'onPasswordChange').and.callThrough();
    component.initializeFormFields();
    let errors = {};
    const password = component.signUpForm.controls['password'];
    password.setValue('aA1');
    tick(200);
    errors = password.errors || {};
    expect(component.onPasswordChange).toHaveBeenCalled();
    expect(password.errors.passwordError).toEqual('Password must contain a minimum of 8 characters including numerals, '
    + 'lower and upper case alphabets and special characters.');
  }));
  it('should show required at least 8 characters validation error message for password', fakeAsync(() => {
    spyOn(component, 'onPasswordChange').and.callThrough();
    component.initializeFormFields();
    let errors = {};
    const password = component.signUpForm.controls['password'];
    password.setValue('aA1@');
    tick(200);
    errors = password.errors || {};
    expect(component.onPasswordChange).toHaveBeenCalled();
    expect(password.errors.passwordError).toEqual('Password must contain a minimum of 8 characters including numerals, '
    + 'lower and upper case alphabets and special characters.');
  }));
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
    password.setValue('passwWORD1@');
    const confirmPassword = component.signUpForm.controls['confirmPassword'];
    confirmPassword.setValue('passwWORD1@');
    const email = component.signUpForm.controls['email'];
    email.setValue('abc@gmail.com');
    const contactType = component.signUpForm.controls['contactType'];
    contactType.setValue('email');
    const uniqueContact = component.signUpForm.controls['uniqueContact'];
    uniqueContact.setValue(true);
    expect(component.disableSubmitBtn).toBeFalsy();
  });
  it('should call displayPassword method to show password', () => {
    component.ngOnInit();
    component.displayPassword();
    expect(component.showPassword).toBeTruthy();
  });
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

  it('should validate user contact type for phone number', () => {
    component.initializeFormFields();
    const contactType = component.signUpForm.controls['contactType'];
    const phone = component.signUpForm.controls['phone'];
    contactType.setValue('phone');
    phone.setValue('959562561');
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'checkUserExists').and.returnValue(observableOf({
      'responseCode': 'OK', 'result': {'exists': false}
    }));
    component.vaidateUserContact();
    expect(component.showUniqueError).toBe('');
    expect(component.signUpForm.controls['uniqueContact'].value).toBeTruthy();
  });

  it('should validate user contact type for phone number and throw user exist', () => {
    component.initializeFormFields();
    const contactType = component.signUpForm.controls['contactType'];
    const phone = component.signUpForm.controls['phone'];
    contactType.setValue('phone');
    phone.setValue('959562561');
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'checkUserExists').and.returnValue(observableOf({
      'responseCode': 'OK', 'result': {'exists': true}
    }));
    component.vaidateUserContact();
    expect(component.showUniqueError).toBe('uniquePhone');
    expect(component.signUpForm.controls['uniqueContact'].value).toBe('');
  });

  it('should validate user contact type for phone number and throw error as api failed', () => {
    component.initializeFormFields();
    const contactType = component.signUpForm.controls['contactType'];
    const phone = component.signUpForm.controls['phone'];
    contactType.setValue('phone');
    phone.setValue('959562561');
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'checkUserExists').and.returnValue(observableThrowError({
      'responseCode': '500', 'params': {'status': 500, 'type': 'INTERNAL_SERVER_ERROR'}
    }));
    component.vaidateUserContact();
    expect(component.showUniqueError).toBe('');
    expect(component.signUpForm.controls['uniqueContact'].value).toBeTruthy();
  });

});
