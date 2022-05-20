import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { DatasetsComponent } from './program-datasets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { KendraService, UserService, FormService } from '@sunbird/core';
import { ResourceService, SharedModule, ConfigService, OnDemandReportService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { mockData } from './program-datasets.component.spec.data';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DatasetsComponent', () => {
  let component: DatasetsComponent;
  let fixture: ComponentFixture<DatasetsComponent>;


  const resourceServiceMockData = {
    frmelmnts: {
      btn: {
        ok: 'ok',
        yes: 'yes',
        no: 'no'

      },
      lbl: {
        program: 'Program Name',
        solution: 'Solution Name',
        reportType: 'Report Type',
        csvDataSets: 'CSV Datasets',
        programDatasets: 'Program Datasets',
        detailsReports: 'Details Reports',
        confirmReportRequest: 'Are you sure you want to request this report?'
      }
    }
  };
  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        SuiModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule, NoopAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              params: {
                reportId: '123'
              },
              data: {
                telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' }
              }
            }
          }
        },
        { provide: ResourceService, useValue: resourceServiceMockData },
        KendraService,
        ConfigService,
        OnDemandReportService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(DatasetsComponent);
    component = fixture.componentInstance;
    component.layoutConfiguration = {};
    component.formData = mockData.FormData;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should fetch programsList', () => {
    const userService:any = TestBed.inject(UserService);
    userService._userData$.next({ err: null, userProfile: mockData.userProfile as any});
    userService._userProfile = mockData.userProfile;
    component.userRoles = mockData.userProfile.roles;
    const kendraService = TestBed.inject(KendraService);
    spyOn(kendraService, 'get').and.returnValue(observableOf(mockData.programs));
    component.getProgramsList();
    expect(component.programs).toEqual(mockData.programs.result);

  });

  it('should call programSelection', () => {
    const kendraService = TestBed.inject(KendraService);
    component.programs = mockData.programs.result;
    spyOn(kendraService, 'get').and.returnValue(observableOf({ result: mockData.solutions.result }));
    component.programSelection({
      value: '5f34ec17585244939f89f90c'
    });
    expect(component.solutions).toEqual(mockData.solutions.result);

  });

  it('should call getSolutionList', () => {
    const kendraService = TestBed.inject(KendraService);
    component.programs = mockData.programs.result;

    component.solutions = [];
    spyOn(kendraService, 'get').and.returnValue(observableOf(mockData.solutions));
    component.getSolutionList({
      '_id': '5f34e44681871d939950bca6',
      'externalId': 'TN-Program-1597301830708',
      'name': 'TN-Program',
      'description': 'TN01-Mantra4Change-APSWREIS School Leader Feedback',
      'role': 'PM'
    });
    expect(component.solutions).toEqual(mockData.solutions.result);

  });

  it('should call closeModal', () => {
    component.closeModal();
    expect(component.popup).toEqual(false);
  });
  it('should call closeConfirmModal', () => {
    component.closeConfirmModal();
    expect(component.awaitPopUp).toEqual(false);
  });
  it('should call closeConfirmationModal', () => {
    component.closeConfirmModal();
    expect(component.showConfirmationModal).toEqual(false);
  });

  it('should load reports', () => {
    component.tag = 'mockTag';
    component.onDemandReportData = [];
    const onDemandReportService = TestBed.inject(OnDemandReportService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(observableOf({ result: mockData.reportListResponse.result }));
    component.loadReports();
    expect(component.onDemandReportData).toEqual(mockData.reportListResponse.result.jobs);
  });

  it('should populate data as submit request succeess', () => {
    component.tag = 'mockTag';
    component.programSelected = '5f34ec17585244939f89f90c';
    component.userId = 'userId';
    component.reportForm.get('reportType').setValue(['Status Report']);
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    component.selectedReport =  {
      'name': 'Status Report',
      'encrypt': false,
      'datasetId': 'ml-observation-status-report',
      filters:[
        {
            "type": "equals",
            "dimension": "program_id",
            "value": "$programId"
        },
        {
            "type": "equals",
            "dimension": "solution_id",
            "value": "$solutionId"
        },
        {
            "type": "equals",
            "dimension": "district_externalId",
            "value": "$district_externalId"
        },
        {
            "type": "equals",
            "dimension": "organisation_id",
            "value": "$organisation_id"
        }
      ]
    };
    component.onDemandReportData = [{1: 'a' , requestId: '0', dataset: 'ml-observation-status-report0', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report0' } }];
    component.reportTypes = mockData.FormData['observation'];
    const onDemandReportService = TestBed.inject(OnDemandReportService);
    spyOn(onDemandReportService, 'submitRequest').and.returnValue(observableOf({result: {requestId: '1', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report' }, title: 'Status Report', 2: 'b', dataset: 'ml-observation-status-report'}}));
    component.submitRequest();
    expect(component.onDemandReportData).toEqual([{
      requestId: '1', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report'
    }, title: 'Status Report', 2: 'b', dataset: 'ml-observation-status-report'
  }, {1: 'a', requestId: '0', dataset: 'ml-observation-status-report0', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report0' } }]);
  });



  it('should call getFormDetails', fakeAsync(() => {

    const formService = TestBed.inject(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockData.FormData));
    component.getFormDetails();
    expect(component.formData).toEqual(mockData.FormData);

  }));

  it('should call selectSolution', fakeAsync(() => {

    const spy = spyOn(component, 'selectSolution').and.callThrough();
    tick(1000);
    component.programs = mockData.programs.result;
    component.programSelected = '5f34ec17585244939f89f90c';
    component.formData = mockData.FormData;

    component.onDemandReportData = [];
    const onDemandReportService = TestBed.inject(OnDemandReportService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(observableOf({ result: mockData.reportListResponse.result }));
    component.loadReports();
    tick(1000);
    spyOn(component,'loadReports').and.callThrough();
    component.reportForm.get('solution').setValue(['5f34ec17585244939f89f90d']);
    component.solutions = mockData.solutions.result;
    component.selectSolution({
      value: '5f34ec17585244939f89f90d'
    });
    expect(component.loadReports).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.reportTypes).toEqual([
      {
        'name': 'Task Detail Report',
        'encrypt': true,
        'datasetId': 'ml-observation_with_rubric-task-detail-report',
        'roles': ['PM']
    },
    {
        'name': 'Status Report',
        'encrypt': false,
        'datasetId': 'ml-observation_with_rubric-status-report',
        'roles': ['PM']
    },
    {
        'name': 'Domain Criteria Report',
        'encrypt': false,
        'datasetId': 'ml-observation_with_rubric-domain-criteria-report',
        'roles': ['PM']
    }
    ]);
    flush();


  }));

  it('should call selectSolution with improvement', fakeAsync(() => {

    const spy = spyOn(component, 'selectSolution').and.callThrough();
    tick(1000);
    component.programs = mockData.programs.result;
    component.programSelected = '5f34ec17585244939f89f90c';
    component.formData = mockData.FormData;

    component.onDemandReportData = [];
    const onDemandReportService = TestBed.inject(OnDemandReportService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(observableOf({ result: mockData.reportListResponse.result }));
    // component.loadReports();
    tick(1000);
    spyOn(component,'loadReports').and.callThrough();
   
    component.reportForm.get('solution').setValue(['5fbb75537380505718640436']);
    component.solutions = mockData.solutions.result;
    component.selectSolution({
      value: '5fbb75537380505718640436'
    });

    expect(component.loadReports).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();

    expect(component.reportTypes).toEqual([
      {
        'name': 'Task Detail Report',
        'encrypt': true,
        'datasetId': 'ml-improvementproject-task-detail-report',
        'roles': ['PM']
    },
    {
        'name': 'Status Report',
        'encrypt': false,
        'datasetId': 'ml-improvementproject-status-report',
        'roles': ['PM']

    }
    ]);
    flush();


  }));

  it('should call selectSolution with survey', fakeAsync(() => {

    const spy = spyOn(component, 'selectSolution').and.callThrough();
    tick(1000);
    component.programSelected = '5f34ec17585244939f89f90c';
    component.formData = mockData.FormData;

    component.onDemandReportData = [];
    const onDemandReportService = TestBed.inject(OnDemandReportService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(observableOf({ result: mockData.reportListResponse.result }));

    component.loadReports();
    component.solutions = mockData.solutions.result;  
    component.selectSolution({
      value: '5fbb75537380505718640438'
    });
    tick(1000);
    expect(spy).toHaveBeenCalled();
    expect(component.reportTypes).toEqual([]);

  }));

  	
  it('should call getReportTypes', fakeAsync(() => {
    spyOn(component,'getReportTypes').and.callThrough();
    component.programs = mockData.programs.result;
    component.formData = mockData.FormData;
    component.reportTypes = [];
    component.getReportTypes("5f34ec17585244939f89f90c","observation");
    tick(1000);
    expect(component.getReportTypes).toHaveBeenCalled();
    expect(component.reportTypes).toEqual([
      {
        'name': 'Question Report',
        'encrypt': true,
        'datasetId': 'ml-observation-question-report',
        'roles': ['PM']
      },
      {
        'name': 'Status Report',
        'encrypt': false,
        'datasetId': 'ml-observation-status-report',
        'roles': ['PM']
      }
    ]);
  }));

  it('should call getReportTypes for invalid solution', fakeAsync(() => {

    spyOn(component,'getReportTypes').and.callThrough();
    component.programs = mockData.programs.result;
    component.formData = mockData.FormData;
    component.reportTypes = [];
    component.getReportTypes("5f34ec17585244939f89f90k","observations");
    tick(1000);
    expect(component.getReportTypes).toHaveBeenCalled();
    expect(component.reportTypes).toEqual([]);

  }));

  it('should call resetFilter', fakeAsync(() => {

    const spy = spyOn(component, 'resetFilter').and.callThrough();
    component.reportForm.get('reportType').setValue(['Status Report']);
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    component.resetFilter();
    tick(1000);
    expect(spy).toHaveBeenCalled();
    expect(component.filter).toEqual([]);
    expect(component.goToPrevLocation).toEqual(false);

  }));

  it('should call getDistritAndOrganisationList', fakeAsync(() => {

    const kendraService = TestBed.inject(KendraService);
    component.programSelected = '5f34ec17585244939f89f90c';
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    const spy = spyOn(kendraService, 'get').and.returnValue(observableOf(mockData.districtAndOrganisations));
    component.getDistritAndOrganisationList();
    expect(spy).toHaveBeenCalled();
    expect(component.districts).toEqual(mockData.districtAndOrganisations.result.districts);
    expect(component.organisations).toEqual(mockData.districtAndOrganisations.result.organisations);


  }));

  it('should call districtSelection', fakeAsync(() => {

    const spy = spyOn(component, 'districtSelection').and.callThrough();
    component.districtSelection({ value: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03" });
    tick(1000);
    expect(spy).toHaveBeenCalled();
  }));

  it('should call organisationSelection', fakeAsync(() => {

    const spy = spyOn(component, 'organisationSelection').and.callThrough();
    component.organisationSelection({ value: "01269878797503692810" });
    tick(1000);
    expect(spy).toHaveBeenCalled();
  }));

  it('should call addFilters', fakeAsync(() => {

    const spy = spyOn(component, 'addFilters').and.callThrough();
    component.reportForm.get('programName').setValue('5f34ec17585244939f89f90c');
    component.reportForm.get('solution').setValue('01285019302823526477');
    component.reportForm.get('districtName').setValue('2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03');
    component.reportForm.get('organisationName').setValue('01269878797503692810');
    component.selectedReport = {
      filters:[
      {
          "type": "equals",
          "dimension": "program_id",
          "value": "$programId"
      },
      {
          "type": "equals",
          "dimension": "solution_id",
          "value": "$solutionId"
      },
      {
          "type": "equals",
          "dimension": "district_externalId",
          "value": "$district_externalId"
      },
      {
          "type": "equals",
          "dimension": "organisation_id",
          "value": "$organisation_id"
      }
    ]}
    component.addFilters();
    tick(1000);
    expect(spy).toHaveBeenCalled();
    expect(component.filter).toEqual([
      {
          "type": "equals",
          "dimension": "program_id",
          "value": "5f34ec17585244939f89f90c"
      },
      {
          "type": "equals",
          "dimension": "solution_id",
          "value": "01285019302823526477"
      },
      {
          "type": "equals",
          "dimension": "district_externalId", 
          "value": "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03"
      },
      {
          "type": "equals",
          "dimension": "organisation_id",
          "value": "01269878797503692810"
      }
    ]);

  }));

  it('should call goBack', ()=> {
    spyOn(component, 'goBack').and.callThrough();
    component.goToPrevLocation = false;
    component.goBack();
    expect(component.showPopUpModal).toEqual(false);
  });

  it('should call confirm', () => {
    spyOn(component, 'confirm').and.callThrough();
    component.confirm();
    expect(component.showPopUpModal).toEqual(false);
  });
});
