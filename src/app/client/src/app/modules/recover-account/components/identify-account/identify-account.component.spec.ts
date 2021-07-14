import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountService } from './../../services';
import { IdentifyAccountComponent } from './identify-account.component';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule, ResourceService, RecaptchaService, ToasterService} from '@sunbird/shared';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { identifyAcountMockResponse } from './identify-account.component.spec.data';
import { RecaptchaModule } from 'ng-recaptcha';
import { By } from '@angular/platform-browser';
import { RecaptchaComponent } from 'ng-recaptcha';
import { configureTestSuite } from '@sunbird/test-util';

describe('IdentifyAccountComponent', () => {
  let component: IdentifyAccountComponent;
  let fixture: ComponentFixture<IdentifyAccountComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceServiceMockData = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      stmsg: { m0009: 'error' },
      emsg: { m0005: 'error' }
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description'
      }
    }
  };
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: { env: 'course', pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } }
      },
      queryParams: {
        client_id: 'test_123',
        error_callback: 'https://dev.sunbirded.org/profile',
        redirect_uri: '',
        scope: '',
        state: '',
        response_type: '',
        version: ''
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
      declarations: [IdentifyAccountComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), FormsModule, ReactiveFormsModule, CoreModule,
        SharedModule.forRoot(), RecaptchaModule],
      providers: [RecoverAccountService, RecaptchaService, TelemetryService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(document, 'getElementById').and.returnValue({ value: '1234' });
    fixture = TestBed.createComponent(IdentifyAccountComponent);
    component = fixture.componentInstance;
    component.isP1CaptchaEnabled = 'true';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move forward to the next step', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    const telemetryService = TestBed.get(TelemetryService);
    const recaptchaService = TestBed.get(RecaptchaService);
    spyOn(recaptchaService, 'validateRecaptcha').and.returnValue(of(identifyAcountMockResponse.recaptchaResponse));
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.returnValue(of(identifyAcountMockResponse.fuzzySuccessResponseWithCount));
    spyOn(component, 'navigateToNextStep').and.callThrough();
    component.handleNext('mockcaptchaResponse');
    expect(component.navigateToNextStep).toHaveBeenCalledWith(identifyAcountMockResponse.fuzzySuccessResponseWithCount);
  });

  it('should not move forward to the next step', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    const recaptchaService = TestBed.get(RecaptchaService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.returnValue(of(identifyAcountMockResponse.fuzzySuccessResponseWithoutCount));
    spyOn(recaptchaService, 'validateRecaptcha').and.returnValue(of(identifyAcountMockResponse.recaptchaResponse));
    component.handleNext('mockcaptchaResponse');
    expect(component.identiferStatus).toBe('NOT_MATCHED');
    expect(component.nameNotExist).toBe(true);
  });

  xit('should fail recaptcha validation failed', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    const recaptchaService = TestBed.get(RecaptchaService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'generateErrorEvent');
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.returnValue(of(identifyAcountMockResponse.fuzzySuccessResponseWithoutCount));
    spyOn(recaptchaService, 'validateRecaptcha').and.returnValue(throwError(identifyAcountMockResponse.recaptchaErrorResponse));
    component.handleNext('mockcaptchaResponse');
    expect(telemetryService.generateErrorEvent).toHaveBeenCalledWith(identifyAcountMockResponse.telemetryLogError);
  });

  it('should throw error if form fields are partially matched', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    const recaptchaService = TestBed.get(RecaptchaService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.callFake(() =>
      throwError(identifyAcountMockResponse.fuzzySearchErrorResponsePartial));
    spyOn(component, 'handleError').and.callThrough();
    spyOn(recaptchaService, 'validateRecaptcha').and.returnValue(of(identifyAcountMockResponse.recaptchaResponse));
    component.handleNext('mockcaptchaResponse');
    expect(component.identiferStatus).toBe('MATCHED');
    expect(component.handleError).toHaveBeenCalledWith(identifyAcountMockResponse.fuzzySearchErrorResponsePartial);
  });

  it('should throw error if form fields are not matched', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    const recaptchaService = TestBed.get(RecaptchaService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.callFake(() =>
      throwError(identifyAcountMockResponse.fuzzySearchErrorResponse));
    spyOn(recaptchaService, 'validateRecaptcha').and.returnValue(of(identifyAcountMockResponse.recaptchaResponse));
    component.handleNext('mockcaptchaResponse');
    expect(component.identiferStatus).toBe('NOT_MATCHED');
    expect(component.nameNotExist).toBe(true);
  });

  it('should load re-captcha when googleCaptchaSiteKey is provided', () => {
    const recapta = fixture.debugElement.query(By.directive(RecaptchaComponent));
    expect(recapta).toBeTruthy();
  });

  it('should call initializeForm with invalid status ', () => {
    component.initializeForm();
    component.form.patchValue({
      identifier: 123456,
      name: 'test'
    });
    expect(component.nameNotExist).toBeFalsy();
    expect(component.disableFormSubmit).toBeTruthy();
  });
  it('should call initializeForm with valid status', () => {
    component.initializeForm();
    component.form.patchValue({
      identifier: 'test001@yopmail.com',
      name: 'test'
    });
    expect(component.nameNotExist).toBeFalsy();
    expect(component.disableFormSubmit).toBeFalsy();
  });
});
