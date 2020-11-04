import { VerifyAccountIdentifierComponent } from './verify-account-identifier.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountService } from './../../services';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule, ResourceService, UtilService, ToasterService} from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { RecaptchaModule } from 'ng-recaptcha';

describe('VerifyAccountIdentifierComponent', () => {
  let component: VerifyAccountIdentifierComponent;
  let fixture: ComponentFixture<VerifyAccountIdentifierComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceServiceMockData = {
    messages: {
      imsg: {m0027: 'Something went wrong', m0086: 'otp attempt left {remainingAttempt}'},
      stmsg: { m0009: 'error' },
      emsg: {m0005: 'error', m0050: 'failed'}
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description',
        otpValidationFailed: 'OTP validation failed.'
      }
    }
  };
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: { env: 'course', pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } }
      }
    };
    queryParamsMock = { contentId: 'do_112270494168555520130' };
    queryParams = of(this.queryParamsMock);
    public changeQueryParams(params) {
      this.queryParamsMock = params;
    }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyAccountIdentifierComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), FormsModule, ReactiveFormsModule,
        RecaptchaModule, CoreModule, SharedModule.forRoot()],
      providers: [RecoverAccountService, UtilService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAccountIdentifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    recoverAccountService.fuzzySearchResults = [{}];
    recoverAccountService.selectedAccountIdentifier = {
      id: '123'
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to login as no attempt left', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'redirectToLogin').and.callFake(() => {
    });
    component.handleError({error: {result: {remainingAttempt: 0}}});
    expect(utilService.redirectToLogin).toHaveBeenCalledWith(resourceServiceMockData.messages.emsg.m0050);
  });

  it('should show toaster error message as otp is wrong', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {
    });
    component.handleError({error: {result: {remainingAttempt: 1}}});
    expect(toasterService.error).toHaveBeenCalledWith('otp attempt left 1');
  });

});
