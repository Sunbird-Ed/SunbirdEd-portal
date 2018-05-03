import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { FormBuilder } from '@angular/forms';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupService } from '../../services/signup.service';
import { Router } from '@angular/router';
import { mockSignUpResponse } from './signup.component.spec.data';
import { Observable } from 'rxjs/Observable';
import { CoreModule, LearnerService } from '@sunbird/core';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [SuiModule, SharedModule, CoreModule, HttpClientTestingModule],
      providers: [FormBuilder, ResourceService, SignupService, LearnerService,
        { provide: Router, useClass: RouterStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call redirect method', () => {
    const router = TestBed.get(Router);
    component.redirect();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should call onSubmitForm method and return success response', () => {
    const router = TestBed.get(Router);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockSignUpResponse.resourceBundle.messages;
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'signup').and.callFake(() => Observable.of(mockSignUpResponse.successRespone));
    component.onSubmitForm();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should call onSubmitForm method and return failure response', () => {
    const router = TestBed.get(Router);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockSignUpResponse.resourceBundle.messages;
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'signup').and.callFake(() => Observable.of(mockSignUpResponse.failureResponse));
    component.onSubmitForm();
  });
});
