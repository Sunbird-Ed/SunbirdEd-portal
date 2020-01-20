import { SelectAccountIdentifierComponent } from './select-account-identifier.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountService } from './../../services';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
        description: 'description'
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAccountIdentifierComponent],
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
});
