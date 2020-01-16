import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountService } from './../../services';
import { IdentifyAccountComponent } from './identify-account.component';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { identifyAcountMockResponse } from './identify-account.component.spec.data';
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdentifyAccountComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), FormsModule, ReactiveFormsModule, CoreModule, SharedModule.forRoot()],
      providers: [RecoverAccountService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move forward to the next step', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.returnValue(of(identifyAcountMockResponse.fuzzySuccessResponseWithCount));
    spyOn(component, 'navigateToNextStep').and.callThrough();
    component.handleNext();
    expect(component.navigateToNextStep).toHaveBeenCalledWith(identifyAcountMockResponse.fuzzySuccessResponseWithCount);
  });

  it('should not move forward to the next step', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.returnValue(of(identifyAcountMockResponse.fuzzySuccessResponseWithoutCount));
    component.handleNext();
    expect(component.identiferStatus).toBe('NOT_MATCHED');
    expect(component.nameNotExist).toBe(true);
  });

  it('should throw error if form fields are partially matched', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.callFake(() =>
      throwError(identifyAcountMockResponse.fuzzySearchErrorResponsePartial));
    spyOn(component, 'handleError').and.callThrough();
    component.handleNext();
    expect(component.identiferStatus).toBe('MATCHED');
    expect(component.handleError).toHaveBeenCalledWith(identifyAcountMockResponse.fuzzySearchErrorResponsePartial);
  });

  it('should throw error if form fields are not matched', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    spyOn(recoverAccountService, 'fuzzyUserSearch').and.callFake(() =>
      throwError(identifyAcountMockResponse.fuzzySearchErrorResponse));
    component.handleNext();
    expect(component.identiferStatus).toBe('NOT_MATCHED');
    expect(component.nameNotExist).toBe(true);
  });

});
