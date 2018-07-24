
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { mockSignUpResponse } from './signup.component.spec.data';
import { CoreModule, LearnerService } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'signup', pageid: 'signup', type: 'edit', subtype: 'paginate'
      }
    }
  }
};
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [FormsModule, ReactiveFormsModule, SuiModule,
         SharedModule.forRoot(), CoreModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
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

  it('should call redirect method', () => {
    const router = TestBed.get(Router);
    component.redirect();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should show validation error message for form', () => {
    component.signUpForm = undefined;
    component.ngOnInit();
    expect(component.signUpForm.valid).toBeFalsy();
  });
  it('should show validation error message for userName', () => {
    component.ngOnInit();
    let errors = {};
    const userName = component.signUpForm.controls['userName'];
    userName.setValue('');
    errors = userName.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('should show pattern match error message for userName', () => {
    component.ngOnInit();
    let errors = {};
    const userName = component.signUpForm.controls['userName'];
    userName.setValue('test');
    errors = userName.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });
  it('should show validation error message for firstName', () => {
    component.ngOnInit();
    let errors = {};
    const firstName = component.signUpForm.controls['firstName'];
    firstName.setValue('');
    errors = firstName.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('should show pattern match error message for firstName', () => {
    component.ngOnInit();
    let errors = {};
    const firstName = component.signUpForm.controls['firstName'];
    firstName.setValue('    test  ');
    errors = firstName.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });
  it('should show validation error message for phone', () => {
    component.ngOnInit();
    let errors = {};
    const phone = component.signUpForm.controls['phone'];
    phone.setValue('');
    errors = phone.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('should show pattern match error message for phone', () => {
    component.ngOnInit();
    let errors = {};
    const phone = component.signUpForm.controls['phone'];
    phone.setValue('8989');
    errors = phone.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });
  it('email field validity', () => {
    component.ngOnInit();
    let errors = {};
    const email = component.signUpForm.controls['email'];
    email.setValue('');
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('should show pattern match error message for email', () => {
    component.ngOnInit();
    let errors = {};
    const email = component.signUpForm.controls['email'];
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });
  it('should call onSubmitForm method and return success response', () => {
    const router = TestBed.get(Router);
    const toasterService = TestBed.get(ToasterService);
    component.signUpForm = new FormGroup({});
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockSignUpResponse.resourceBundle.messages;
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'signup').and.callFake(() => observableOf(mockSignUpResponse.successResponse));
    spyOn(toasterService, 'success').and.callThrough();
    component.onSubmitForm();
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0039);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should call onSubmitForm method and return failure response', () => {
    const router = TestBed.get(Router);
    component.signUpForm = new FormGroup({});
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockSignUpResponse.resourceBundle.messages;
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'signup').and.callFake(() => observableOf(mockSignUpResponse.failureResponse));
    component.onSubmitForm();
    expect(component.showLoader).toBeFalsy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.signUpForm = new FormGroup({});
    component.onSubmitForm();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
