// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatasetsComponent } from './datasets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { KendraService, UserService, FormService } from '@sunbird/core';
import { ResourceService,SharedModule,ConfigService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { mockData } from './datasets.component.spec.data';
import { of as observableOf, throwError as observableThrowError, of,Subject } from 'rxjs';
// import { ResourceService } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('DatasetsComponent', () => {
  let component: DatasetsComponent;
  let fixture: ComponentFixture<DatasetsComponent>;


  const resourceServiceMockData = {
    frmelmnts: {
      btn: {
       ok:'ok',
        yes: 'yes',
        no: 'no'
        
      },
      lbl: {
        program : "Program Name",
        solution : "Solution Name",
        reportType : "Report Type",
        csvDataSets: 'CSV Datasets',
        programDatasets: 'Program Datasets',
        detailsReports: 'Details Reports',
        confirmReportRequest: 'Are you sure you want to request this report?'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        SharedFeatureModule,
        SuiModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers:[
        { provide: ActivatedRoute, useValue: {
          snapshot: {
              params: {
                  reportId: '123'
              },
              data: {
                  telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' }
              }
          }
      } },
        { provide: ResourceService,useValue: resourceServiceMockData},
        KendraService,
        ConfigService
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ DatasetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
    fixture = TestBed.createComponent(DatasetsComponent);
    // component.config = ConfigService;
    component = fixture.componentInstance;
    component.layoutConfiguration = {};
    component.formData = mockData.FormData;
    // component.programs = mockData.programs;
    component.solutions = mockData.solutions;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call getProgramsList', () => {
  //   // expect(component).toBeTruthy();
  //   const spy = spyOn(component, 'getProgramsList').and.callThrough();
  //   component.ngOnInit();

  //   expect(spy).toHaveBeenCalled();
  // });

  // it('should call requestDataset', fakeAsync(() => {
  //   // expect(component).toBeTruthy();
  // //   const spy = spyOn(component, 'requestDataset').and.callThrough();
  // //   component.ngOnInit();
  // //   expect(spy).toHaveBeenCalled();
  // //   component.selectedReport =  {
  // //     "name": "Task Detail Report",
  // //     "encrypt": true,
  // //     "datasetId": "ml-improvementproject-task-detail-report"
  // // };
  // //   expect(component.popup).toEqual(true);


  //   const spy = spyOn(component, 'requestDataset').and.callThrough();
  //   // component.ngOnInit();
  //   // tick(1000);
  //   component.selectedReport =  {
  //         "name": "Task Detail Report",
  //         "encrypt": false,
  //         "datasetId": "ml-improvementproject-task-detail-report"
  //     };
  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toHaveBeenCalledTimes(1);
  //   expect(component.popup).toEqual(false);
  //   // expect(component.filtersFormGroup.contains('state')).toBe(true);
  //   // expect(component.filtersFormGroup.controls).toBeTruthy();

  // }));

  // it('should fetch programsList', () => {
  //   // const userService = TestBed.get(UserService);

  //   const userService = TestBed.get(UserService);
  //   // const certificateService  = TestBed.get(CertificateService);
  //   userService._userData$.next({ err: null, userProfile: mockData.userProfile });
  //   userService._userProfile = mockData.userProfile;
  //   // spyOn(certificateService, 'fetchCertificatePreferences').and.returnValue(observableOf(CertMockResponse.certRulesData));

    

  //   const configService = TestBed.get(ConfigService);
  //   const kendraService = TestBed.get(KendraService);
  //   // spyOn(kendraService, 'get').and.returnValue(observableOf(mockData.programs));
  //   spyOn(kendraService, 'get').and.returnValues({ err: null, result: mockData.programs.result });
  //   // kendraService.next({ err: null, result: mockData.programs.result });
  //   // and.returnValue(mockData.programs);
  //   component.getProgramsList();
  //   const paramOptions = {
  //     url:
  //     configService.urlConFig.URLS.KENDRA.PROGRAMS_BY_PLATFORM_ROLES
  //   };
  //   // const url = {url : 'user/v1/feed/' + userService.userId};

   
  //   expect(kendraService.get).toHaveBeenCalledWith(paramOptions);
  //   expect(component.programs).toEqual(mockData.programs.result);
  // });


  it('should fetch programsList', () => {
    // const userService = TestBed.get(UserService);

    const userService = TestBed.get(UserService);
    // const certificateService  = TestBed.get(CertificateService);
    userService._userData$.next({ err: null, userProfile: mockData.userProfile });
    userService._userProfile = mockData.userProfile;
    // spyOn(certificateService, 'fetchCertificatePreferences').and.returnValue(observableOf(CertMockResponse.certRulesData));

    

    const configService = TestBed.get(ConfigService);
    const kendraService = TestBed.get(KendraService);
    

      /** Arrange */
  // const certificateService  = TestBed.get(CertificateService);
  spyOn(kendraService, 'get').and.returnValue(observableOf( mockData.programs));
  // spyOn(component, 'getCertConfigFields').and.stub();

  /** Act */
  component.getProgramsList();

  // /** Assert */
  // component.getProgramsList().subscribe( data => {
  //   expect(component.programs).toEqual(mockData.programs.result);
  //   // expect(component.getCertConfigFields).toHaveBeenCalled();
  // });

  });




  // it('should call reportChanged', () => {
  //   // component.ngOnInit();
  //   // tick(1000);
  //   const report =  {
  //     "name": "Task Detail Report",
  //     "encrypt": false,
  //     "datasetId": "ml-improvementproject-task-detail-report"
  // };
  //   component.reportChanged(report);
  //   expect(component.selectedReport).toEqual(report);

  // });

});
