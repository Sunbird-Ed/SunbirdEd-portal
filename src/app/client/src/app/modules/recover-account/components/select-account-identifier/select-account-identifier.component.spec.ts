import { SelectAccountIdentifierComponent } from './select-account-identifier.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountService } from './../../services';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { RecaptchaModule } from 'ng-recaptcha';

describe('SelectAccountIdentifierComponent', () => {
  let component: SelectAccountIdentifierComponent;
  let fixture: ComponentFixture<SelectAccountIdentifierComponent>;
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
        description: 'description',
        generateOtpFailed: 'Generate OTP failed. Please try again'
      }
    }
  };
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: { env: 'course', pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } }
      },
      queryParams: {
        client_id: 'portal', redirectUri: '/learn',
        state: 'state-id', response_type: 'code', version: '3'
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
      declarations: [SelectAccountIdentifierComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), FormsModule, ReactiveFormsModule,
        RecaptchaModule, CoreModule, SharedModule.forRoot()],
      providers: [RecoverAccountService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAccountIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call initializeForm', () => {
    spyOn(component, 'verifyState').and.returnValue(true);
    spyOn(component, 'initializeForm').and.callThrough();
    component.ngOnInit();
    expect(component.initializeForm).toHaveBeenCalled();
  });

  it('should call handleGenerateOtp()', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    spyOn(recoverAccountService, 'generateOTP').and.returnValue(of({}));
    spyOn(component, 'navigateToNextStep').and.callThrough();
    component.handleGenerateOtp();
    expect(component.navigateToNextStep).toHaveBeenCalled();
  });

  it('should call setSelectIdentifier', () => {
    component.setSelectIdentifier('123456')
    expect(component.disableFormSubmit).toBeFalsy();
    expect(component.selectedAccountIdentifier).toBe('123456')
  });
  it('should call submitSelection', () => {
    component.isP2CaptchaEnabled = 'false';
    spyOn(component, 'handleGenerateOtp').and.callThrough();
    component.submitSelection();
    expect(component.handleGenerateOtp).toHaveBeenCalled();
  });
  it('should call resolved', () => {
    spyOn(component, 'handleGenerateOtp').and.callThrough();
    component.resolved('test');
    expect(component.handleGenerateOtp).toHaveBeenCalled();
  });
  it('should call handleError error case', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error')
    component.errorCount= 0;
    component.handleError('test');
    expect(toasterService.error).toHaveBeenCalled();
  });
});
