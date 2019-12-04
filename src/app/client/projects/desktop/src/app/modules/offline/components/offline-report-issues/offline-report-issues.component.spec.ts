import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { OfflineReportIssuesComponent } from './offline-report-issues.component';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import { SuiModalModule } from 'ng2-semantic-ui';
import { OfflineReportIssuesService } from '../../services';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ofline_report_issues_spect_data } from './offline-report-issues.component.spec.data';
describe('OfflineReportIssuesComponent', () => {
  let component: OfflineReportIssuesComponent;
  let fixture: ComponentFixture<OfflineReportIssuesComponent>;
  let resourceServiceStub;
  let apiData;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'help',
          pageid: 'help'
        }
      }
    };
  }
  beforeEach(async(() => {
    resourceServiceStub = {
      instance: 'sunbird',
      frmelmnts: {
        lbl: {
          issueReportedSuccessfuly: 'Issue reported successfully',
          issueReportedSuccessfulySubNote: 'Note: Your report will be automatically sent to {instance} while online.',
          errorWhileGeneratingTicket: 'Unable to raise ticket. please try again after some times.'
        }
      },
      messages:
      {
        emsg: {
          m0023: 'Unable to raise a ticket because you are not connected to the internet.'
        }
      }
    },
      apiData = {
        email: 'santoh@gmail.com',
        description: 'fdsfsdf'
      };
    TestBed.configureTestingModule({
      declarations: [OfflineReportIssuesComponent],
      imports: [SuiModalModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        OfflineReportIssuesService,
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineReportIssuesComponent);
    component = fixture.componentInstance;
    component.instance = '';
    fixture.detectChanges();
  });
  it('should call createReportOtherissueForm method', () => {
    spyOn(component, 'createReportOtherissueForm');
    component.ngOnInit();
    expect(component.createReportOtherissueForm).toHaveBeenCalled();
    spyOn(component, 'setValidators');

  });
  it('should open report issue modal when you click on Report other issue button', () => {
    spyOn(component, 'openModal');
    const openModal: DebugElement = fixture.debugElement;
    const buttonQuerySelector = openModal.query(By.css('button.sb-btn-outline-primary'));
    const button: HTMLElement = buttonQuerySelector.nativeElement;
    button.click();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.onClickReportOtherIssueInteractEdata).toBeDefined();

    fixture.whenStable().then(() => {
      expect(component.issueReportedSuccessfully).toBeDefined();
      expect(component.openReportIssueModal).toBeDefined();

    });
  });
  it('should throw email validation error ', () => {
    spyOn(component, 'setValidators');
    component.ngOnInit();
    let errors = {};
    const email = component.reportOtherissueForm.controls['email'];
    email.setValue('');
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.reportOtherissueForm.invalid).toBeTruthy();

  });
  it('should throw description validation error ', () => {
    spyOn(component, 'setValidators');
    component.ngOnInit();
    let errors = {};
    const description = component.reportOtherissueForm.controls['description'];
    description.setValue('');
    errors = description.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.reportOtherissueForm.invalid).toBeTruthy();
  });
  it('should show success message when successfully ticket has been raised ', () => {
    const offlineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    spyOn(offlineReportIssuesService, 'reportOtherIssue').and.returnValue(of('true'));
    component.submitIssue();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.raiseSupportTicketInteractEdata).toBeDefined();
    expect(component.issueReportedSuccessfully).toBeDefined();
    expect(component.isDisplayLoader).toBeDefined();
    spyOn(component, 'createReportOtherissueForm');
  });
  it('should throw error an when unable raise ticket ', () => {
    const offlineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    spyOn(offlineReportIssuesService, 'reportOtherIssue').and.returnValue(of('false'));
    component.submitIssue();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.raiseSupportTicketInteractEdata).toBeDefined();
    expect(component.toasterService.error(resourceServiceStub.frmelmnts.lbl.errorWhileGeneratingTicket));
  });
  it('should throw network error an when unable raise ticket ', () => {
    const offlineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    spyOn(offlineReportIssuesService, 'reportOtherIssue').and.returnValue(of('false'));
    spyOn(component.toasterService, 'error').and.returnValue(throwError(resourceServiceStub.frmelmnts.lbl.errorWhileGeneratingTicket));
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.raiseSupportTicketInteractEdata).toBeDefined();
    component.offlineReportIssuesService.reportOtherIssue(apiData).subscribe(res => {

    }, error => {
      expect(component.isDisplayLoader).toBeDefined();
      expect(error['error']['params']['err']).toEqual(ofline_report_issues_spect_data.noNetworkError);
      expect(component.toasterService.error).toHaveBeenCalledWith(resourceServiceStub.messages.emsg.m0023);
    });

  });
  it('should throw fresh desk error an when unable raise ticket ', () => {
    const offlineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    spyOn(offlineReportIssuesService, 'reportOtherIssue').and.returnValue(of('false'));
    spyOn(component, 'setTelemetryData').and.callThrough();
    spyOn(component.toasterService, 'error').and.returnValue(throwError(resourceServiceStub.messages.emsg.m0023));
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.raiseSupportTicketInteractEdata).toBeDefined();
    component.offlineReportIssuesService.reportOtherIssue(apiData).subscribe(res => {

    }, error => {
      expect(component.isDisplayLoader).toBeDefined();
      expect(error['error']['params']['err']).toEqual(ofline_report_issues_spect_data.freshDeskError);
      expect(component.toasterService.error).toHaveBeenCalledWith(resourceServiceStub.frmelmnts.lbl.errorWhileGeneratingTicket);
    });

  });

});
