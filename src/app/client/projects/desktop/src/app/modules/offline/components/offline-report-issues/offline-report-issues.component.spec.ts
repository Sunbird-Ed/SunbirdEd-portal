import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OfflineReportIssuesComponent } from './offline-report-issues.component';
import { ConfigService, ResourceService, BrowserCacheTtlService, ToasterService, SharedModule } from '@sunbird/shared';
import { of as observableOf, throwError } from 'rxjs';
import { SuiModalModule } from 'ng2-semantic-ui';
import { CacheService } from 'ng2-cache-service';
import { OfflineReportIssuesService } from '../../services/offline-report-issues/offline-report-issues.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OfflineReportIssuesComponent', () => {
  let component: OfflineReportIssuesComponent;
  let fixture: ComponentFixture<OfflineReportIssuesComponent>;
  let resourceServiceStub;
  beforeEach(async(() => {
    resourceServiceStub = {
      instance: 'sunbird',
      frmelmnts: {
        lbl: {
          issueReportedSuccessfuly: 'Issue reported successfully',
          issueReportedSuccessfulySubNote: 'Note: Your report will be automatically sent to {instance} while online.'
        }
      }
    };
    TestBed.configureTestingModule({
      declarations: [OfflineReportIssuesComponent],
      imports: [SuiModalModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [
        ConfigService,
        { provide: ResourceService, useValue: resourceServiceStub },
        CacheService,
        ToasterService,
        BrowserCacheTtlService,
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
  });
  it('should open report issue modal when you click on Report other issue button', () => {
    spyOn(component, 'openModal');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.openModal).toHaveBeenCalled();
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
  });
  it('should throw description validation error ', () => {
    spyOn(component, 'setValidators');
    component.ngOnInit();
    let errors = {};
    const description = component.reportOtherissueForm.controls['description'];
    description.setValue('');
    errors = description.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('should call  submitIssue method', () => {
    const offlineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    spyOn(offlineReportIssuesService, 'reportOtherIssue').and.returnValue(observableOf('true'));
    component.submitIssue();
    expect(component.issueReportedSuccessfully).toBeDefined();
    expect(component.isDisplayLoader).toBeDefined();
    spyOn(component, 'createReportOtherissueForm');
    component.ngOnInit();
    expect(component.createReportOtherissueForm).toHaveBeenCalled();
  });
});
