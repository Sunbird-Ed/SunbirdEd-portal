import { fakeAsync, tick, flush } from '@angular/core/testing';
import { of, throwError} from 'rxjs';
import { DatasetsComponent } from './program-datasets.component';
import { KendraService, UserService, FormService } from '@sunbird/core';
import { ResourceService, LayoutService, ConfigService, OnDemandReportService, ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { mockData } from './program-datasets.component.spec.data';
import { ReportService } from '../../../dashboard';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import dayjs from 'dayjs';

describe('DatasetsComponent', () => {
  let component: DatasetsComponent;
  const activatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };;
  const layoutService: Partial<LayoutService> = {
    initlayoutConfig:jest.fn() as any,
    switchableLayout:jest.fn() as any
  };
  const telemetryService: Partial<TelemetryService> = {};
  const resourceService: Partial<ResourceService> = {};
  const kendraService: Partial<KendraService> = {
    get: jest.fn(),
    post: jest.fn()
  }
  const userService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
    userData$: of({ userProfile: mockData.userProfile as any }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };
  const onDemandReportService: Partial<OnDemandReportService> = {
    getReportList: jest.fn() as any,
    submitRequest: jest.fn() as any,
    isInProgress: jest.fn() as any
  };
  const config: Partial<ConfigService> = {
    urlConFig: mockData.urlConfig
  };
  const toasterService: Partial<ToasterService> = {};
  const formService: Partial<FormService> = {
    getFormConfig: jest.fn() as any
  };
  const router: Partial<Router> = {};
  const location: Partial<Location> = {};
  const reportService: Partial<ReportService> = {
    fetchReportById: jest.fn() as any,
    listAllReports:jest.fn().mockReturnValue(mockData.reportConfig) as any,
    getLatestLastModifiedOnDate:jest.fn() as any,
    getFormattedDate:jest.fn() as any,
    downloadMultipleDataSources:jest.fn() as any,
    prepareChartData:jest.fn() as any
  };
  const changeDetectorRef: Partial<ChangeDetectorRef> = {
    detectChanges: jest.fn() as any
  }

  beforeAll(() => {
    component = new DatasetsComponent(
      activatedRoute as ActivatedRoute,
      layoutService as LayoutService,
      telemetryService as TelemetryService,
      resourceService as ResourceService,
      kendraService as KendraService,
      userService as UserService,
      onDemandReportService as OnDemandReportService,
      config as ConfigService,
      toasterService as ToasterService,
      formService as FormService,
      router as Router,
      location as Location,
      reportService as ReportService,
      changeDetectorRef as ChangeDetectorRef
    )
    component.layoutConfiguration = {};
    component.formData = mockData.FormData;
    component.noResultMessage = { 'messageText': 'Something went wrong, try later' }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch programsList', () => {
    userService._userProfile = mockData.userProfile;
    component.userRoles = mockData.userProfile.roles;
    jest.spyOn(kendraService, 'get').mockReturnValue(of(mockData.programs));
    component.getProgramsList();
    expect(component.programs).toEqual(mockData.programs.result);
  });

  it('should call programSelection', () => {
    jest.spyOn(component, 'getReportTypes');
    component.programs = mockData.programs.result;
    component.formData = mockData.FormData;
    component.reportTypes = [];
    component.userId = '1234567890';
    jest.spyOn(kendraService, 'get').mockReturnValue(of(mockData.solutions));
    jest.spyOn(reportService,'listAllReports').mockReturnValue(of(mockData.reportConfig));
    jest.spyOn(kendraService, 'post').mockReturnValue(of(mockData.districtAndOrganisations));
    component.programSelection({
      value: '5f34ec17585244939f89f90c'
    });
    const reqBody = {
      type:'program',
      id:'xxxx-yyyy-zzzz',
      projection:'district'
    }
    component.getDistritAndOrganisationList(reqBody);
    component.getReportTypes("5f34ec17585244939f89f90c", "user_detail_report");
    expect(component.solutions).toEqual(mockData.solutions.result);
  });

  it('should call getSolutionList', () => {
    component.programs = mockData.programs.result;
    component.solutions = [];
    jest.spyOn(kendraService, 'get').mockReturnValue(of(mockData.solutions));
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

  it('should set onDemandReportData to be a combined result if both requests pass', () => {
    jest.spyOn(onDemandReportService,'getReportList').mockReturnValue(of(mockData.reportListResult1)).mockReturnValueOnce(of(mockData.reportListResult2))
    component.loadReports();
    expect(component.onDemandReportData).toEqual(mockData.reportListCombinedResult)
  });

  it('should set onDemandReportData to be the first response if only first request passes and second one fails', () => {
    jest.spyOn(onDemandReportService,'getReportList').mockReturnValue(of(mockData.reportListResult1)).mockReturnValueOnce(of(null))
    component.loadReports();
    expect(component.onDemandReportData).toEqual(mockData.reportListResult1.result.jobs)
  });

  it('should set onDemandReportData to be the second response if only second request passes and first one fails', () => {
    jest.spyOn(onDemandReportService,'getReportList').mockReturnValue(of(null)).mockReturnValueOnce(of(mockData.reportListResult2))
    component.loadReports();
    expect(component.onDemandReportData).toEqual(mockData.reportListResult2.result.jobs)
  });

  it('should set onDemandReportData to be an empty array result if both requests fail', () => {
    component.onDemandReportData = []
    const error = new Error('API error');
    jest.spyOn(onDemandReportService, 'getReportList')
    .mockImplementationOnce(() => throwError(error))
    .mockImplementationOnce(() => throwError(error));
    component.loadReports();
    expect(component.onDemandReportData).toEqual([]);
  });

  it('should populate data as submit request succeeds', () => {
    component.tag = 'mockTag';
    component.programSelected = '5f34ec17585244939f89f90c';
    component.userId = 'userId';
    component.reportForm.get('reportType').setValue(['Status Report']);
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    component.reportForm.get('startDate').setValue('2022-08-01');
    component.reportForm.get('endDate').setValue('2022-08-01');
    component.selectedReport = {
      'name': 'Status Report',
      'encrypt': false,
      'datasetId': 'ml-observation-status-report',
      filters: [
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
    component.onDemandReportData = [{ 1: 'a', requestId: '0', dataset: 'ml-observation-status-report0', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report0' } }];
    component.reportTypes = mockData.FormData['observation'];
    jest.spyOn(onDemandReportService, 'submitRequest').mockReturnValue(of({ result: { requestId: '1', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report' }, title: 'Status Report', 2: 'b', dataset: 'ml-observation-status-report' } }));
    component.submitRequest();
    expect(component.onDemandReportData).toEqual([{
      requestId: '1', datasetConfig: {
        title: 'Status Report', type: 'ml-observation-status-report'
      }, title: 'Status Report', 2: 'b', dataset: 'ml-observation-status-report'
    }, { 1: 'a', requestId: '0', dataset: 'ml-observation-status-report0', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report0' } }]);
  });

  it('should populate data as submit request succeeds with encryption', () => {
    component.tag = 'mockTag';
    component.programSelected = '5f34ec17585244939f89f90c';
    component.userId = 'userId';
    component.reportForm.get('reportType').setValue(['Status Report']);
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    component.reportForm.get('startDate').setValue('2022-08-01');
    component.reportForm.get('endDate').setValue('2022-08-01');
    component.selectedReport = {
      'name': 'Status Report',
      'encrypt': true,
      'datasetId': 'ml-observation-status-report',
      filters: [
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
    component.onDemandReportData = [{ 1: 'a', requestId: '0', dataset: 'ml-observation-status-report0', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report0' } }];
    component.reportTypes = mockData.FormData['observation'];
    jest.spyOn(onDemandReportService, 'submitRequest').mockReturnValue(of({ result: { requestId: '1', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report' }, title: 'Status Report', 2: 'b', dataset: 'ml-observation-status-report' } }));
    component.submitRequest();
    expect(component.onDemandReportData).toEqual([{
      requestId: '1', datasetConfig: {
        title: 'Status Report', type: 'ml-observation-status-report'
      }, title: 'Status Report', 2: 'b', dataset: 'ml-observation-status-report'
    }, { 1: 'a', requestId: '0', dataset: 'ml-observation-status-report0', datasetConfig: { title: 'Status Report', type: 'ml-observation-status-report0' } }]);
  });



  it('should call getFormDetails', () => {
    jest.spyOn(formService, 'getFormConfig').mockReturnValue(of(mockData.FormData));
    component.getFormDetails();
    expect(component.formData).toEqual(mockData.FormData);

  });

  it('should call selectSolution', fakeAsync((done) => {
    const spy = jest.spyOn(component, 'selectSolution');
    tick(1000);
    component.programs = mockData.programs.result;
    component.programSelected = '5f34ec17585244939f89f90c';
    component.formData = mockData.FormData;
    component.onDemandReportData = [];
    component.districts = mockData.districtAndOrganisations.result.districts;
    component.organisations = mockData.districtAndOrganisations.result.organisations;
    jest.spyOn(onDemandReportService, 'getReportList').mockReturnValue(of({ result: mockData.reportListResponse.result }));
    jest.spyOn(reportService, 'listAllReports').mockReturnValue(of(mockData.reportConfig));
    jest.spyOn(kendraService, 'post').mockReturnValue(of(mockData.districtAndOrganisations));
    component.loadReports();
    const reqBody = {
      type:'program',
      id:'xxxx-yyyy-zzzz',
      projection:'district',
      solutionType:'observation'
    }
    component.getDistritAndOrganisationList(reqBody);
    tick(1000);
    jest.spyOn(component, 'loadReports');
    component.reportForm.get('solution').setValue(['5f34ec17585244939f89f90d']);
    component.solutions = mockData.solutions.result;
    component.selectSolution({
      value: '5f34ec17585244939f89f90d',
      source:{triggerValue:'an solution'}
    });
    tick(1000);
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

    const spy = jest.spyOn(component, 'selectSolution');
    tick(1000);
    component.programs = mockData.programs.result;
    component.programSelected = '5f34ec17585244939f89f90c';
    component.formData = mockData.FormData;
    component.districts = mockData.districtAndOrganisations.result.districts;
    component.organisations = mockData.districtAndOrganisations.result.organisations;
    component.onDemandReportData = [];
    jest.spyOn(onDemandReportService, 'getReportList').mockReturnValue(of({ result: mockData.reportListResponse.result }));
    jest.spyOn(reportService, 'listAllReports').mockReturnValue(of(mockData.reportConfig));
    jest.spyOn(kendraService, 'post').mockReturnValue(of(mockData.districtAndOrganisations));
    component.loadReports();
    tick(1000);
    jest.spyOn(component, 'loadReports');
    component.reportForm.get('solution').setValue(['5fbb75537380505718640436']);
    component.solutions = mockData.solutions.result;
    component.selectSolution({
      value: '5fbb75537380505718640436',
      source:{triggerValue:'a solution'}
    });
    tick(1000);
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

    const spy = jest.spyOn(component, 'selectSolution');
    tick(1000);
    component.programSelected = '5f34ec17585244939f89f90c';
    component.formData = mockData.FormData;

    component.onDemandReportData = [];
    jest.spyOn(onDemandReportService, 'getReportList').mockReturnValue(of({ result: mockData.reportListResponse.result }));
    jest.spyOn(reportService, 'listAllReports').mockReturnValue(of(mockData.reportConfig));
    jest.spyOn(kendraService, 'post').mockReturnValue(of(mockData.districtAndOrganisations));
    component.loadReports();
    component.solutions = mockData.solutions.result;
    component.selectSolution({
      value: '5fbb75537380505718640438',
      source:{triggerValue:'a solution'}
    });
    tick(1000);
    expect(spy).toHaveBeenCalled();
    expect(component.reportTypes).toEqual([]);

  }));


  it('should call getReportTypes', fakeAsync(() => {
    jest.spyOn(component, 'getReportTypes');
    component.programs = mockData.programs.result;
    component.formData = mockData.FormData;
    component.reportTypes = [];
    jest.spyOn(reportService, 'listAllReports').mockReturnValue(of(mockData.reportConfig));
    component.getReportTypes("5f34ec17585244939f89f90c", "observation");
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

  it('should call getReportTypes', fakeAsync(() => {
    jest.spyOn(component, 'getReportTypes');
    component.programs = mockData.programs.result;
    component.formData = mockData.FormData;
    component.reportTypes = [];
    jest.spyOn(reportService, 'listAllReports').mockReturnValue(of(mockData.reportConfig));
    component.getReportTypes("5f34ec17585244939f89f90c", "improvementProject");
    tick(1000);
    expect(component.getReportTypes).toHaveBeenCalled();
  }));


  it('should call getReportTypes for invalid solution', fakeAsync(() => {

    jest.spyOn(component, 'getReportTypes');
    component.programs = mockData.programs.result;
    component.formData = mockData.FormData;
    component.reportTypes = [];
    component.getReportTypes("5f34ec17585244939f89f90k", "observations");
    tick(1000);
    expect(component.getReportTypes).toHaveBeenCalled();
    expect(component.reportTypes).toEqual([]);

  }));

  it('should call resetFilter', fakeAsync(() => {

    const spy = jest.spyOn(component, 'resetFilter');
    component.reportForm.get('reportType').setValue(['Status Report']);
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    component.resetFilter();
    tick(1000);
    expect(spy).toHaveBeenCalled();
    expect(component.filter).toEqual([]);
    expect(component.goToPrevLocation).toEqual(false);

  }));

  it('should call getDistritAndOrganisationList', fakeAsync(() => {

    component.programSelected = '5f34ec17585244939f89f90c';
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    const spy = jest.spyOn(kendraService, 'post').mockReturnValue(of(mockData.districtAndOrganisations));
    const reqBody = {
      type:'program',
      id:'xxxx-yyyy-zzzz',
      projection:'district',
      solutionType:'observation'
    }
    component.getDistritAndOrganisationList(reqBody);
    expect(spy).toHaveBeenCalled();
    expect(component.districts).toEqual(mockData.districtAndOrganisations.result.districts);
    expect(component.organisations).toEqual(mockData.districtAndOrganisations.result.organisations);

  }));

  it('should call districtSelection', fakeAsync(() => {
    const spy = jest.spyOn(component, 'districtSelection');
    component.districtSelection({ value: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03", source:{triggerValue:'a district'} });
    tick(1000);
    expect(spy).toHaveBeenCalled();
  }));

  it('should call organisationSelection', fakeAsync(() => {
    const spy = jest.spyOn(component, 'organisationSelection');
    component.organisationSelection({ value: "01269878797503692810", source:{triggerValue:'an org'} });
    tick(1000);
    expect(spy).toHaveBeenCalled();
  }));

  it('should call addFilters', fakeAsync(() => {

    const spy = jest.spyOn(component, 'addFilters');
    component.reportForm.get('programName').setValue('5f34ec17585244939f89f90c');
    component.reportForm.get('solution').setValue('01285019302823526477');
    component.reportForm.get('districtName').setValue('2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03');
    component.reportForm.get('organisationName').setValue('01269878797503692810');
    component.selectedReport = {
      filters: [
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
    }
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

  it('should call addFilters for user detail report', fakeAsync(() => {

    const spy = jest.spyOn(component, 'addFilters');
    component.reportForm.get('programName').setValue('5f34ec17585244939f89f90c');
    component.reportForm.get('districtName').setValue('2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03');
    component.reportForm.get('organisationName').setValue('01269878797503692810');
    component.reportForm.get('startDate').setValue('10/10/2022');
    component.selectedReport = mockData.selectedReportUserDetailReport
    component.addFilters();
    tick(1000);
    expect(spy).toHaveBeenCalled();
    expect(component.filter).toEqual(mockData.filterForUserDeatilReport)
  }));

  it('should call goBack', () => {
    jest.spyOn(component, 'goBack');
    component.goToPrevLocation = false;
    component.goBack();
    expect(component.showPopUpModal).toEqual(false);
  });

  it('should call confirm', () => {
    jest.spyOn(component, 'confirm');
    component.confirm();
    expect(component.showPopUpModal).toEqual(false);
  });
  
  it('should update the selected report data', () => {
    jest.spyOn(component,'reportChanged');
    component.reportChanged(mockData.selectedReport)
    expect(component.selectedReport).toBe(mockData.selectedReport);
    expect(component.reportChanged).toHaveBeenCalled();
  });

  it('should update the selected report data for Filtered task detail report ', () => {
    jest.spyOn(component,'reportChanged');
    component.reportChanged(mockData.selectedReportWithConfigurableFilters[0])
    expect(component.selectedReport).toBe(mockData.selectedReportWithConfigurableFilters[0]);
    expect(component.reportChanged).toHaveBeenCalled();
  });

  it('should update the selected report data for status report ', () => {
    jest.spyOn(component,'reportChanged');
    component.reportChanged(mockData.selectedReportWithConfigurableFilters[1])
    expect(component.selectedReport).toBe(mockData.selectedReportWithConfigurableFilters[1]);
    expect(component.reportChanged).toHaveBeenCalled();
  });

  it('should call pdFilterChanged method for number type', () => {
    jest.spyOn(component,'pdFilterChanged');
    component.pdFilterChanged({data:{task_count:5}, controlType:'number'});
    expect(component.pdFilterChanged).toHaveBeenCalledWith({data:{task_count:5}, controlType:'number'});
  });

  it('should call pdFilterChanged method for number type with negative value', () => {
    jest.spyOn(component,'pdFilterChanged');
    component.pdFilterChanged({data:{task_count:-1}, controlType:'number'});
    expect(component.pdFilterChanged).toHaveBeenCalledWith({data:{task_count:-1}, controlType:'number'});
  });

  it('should call pdFilterChanged method for number type with zero value', () => {
    jest.spyOn(component,'pdFilterChanged');
    component.pdFilterChanged({data:{task_count:0}, controlType:'number'});
    expect(component.pdFilterChanged).toHaveBeenCalledWith({data:{task_count:0}, controlType:'number'});
  });

  it('should call pdFilterChanged method for number type with null value', () => {
    jest.spyOn(component,'pdFilterChanged');
    component.pdFilterChanged({data:{task_count:null}, controlType:'number'});
    expect(component.pdFilterChanged).toHaveBeenCalledWith({data:{task_count:null}, controlType:'number'});
  });

  it('should call pdFilterChanged method', () => {
    jest.spyOn(component,'pdFilterChanged');
    component.pdFilterChanged({data:{status:['started']}, controlType:'multi-select'});
    expect(component.pdFilterChanged).toHaveBeenCalledWith({data:{status:['started']}, controlType:'multi-select'});
  });
  
  it('should request the csv', () => {
    jest.spyOn(component,'csvRequest');
    jest.spyOn(component,'submitRequest');
    component.csvRequest();
    component.submitRequest();
    expect(component.popup).toBe(false);
    expect(component.csvRequest).toHaveBeenCalled();
    expect(component.submitRequest).toHaveBeenCalled();
  })

  it('should handle te confirmation', () => {
    const spy = jest.spyOn(component,'handleConfirmationEvent');
    jest.spyOn(component,'submitRequest');
    component.handleConfirmationEvent(true);
    component.submitRequest();
    expect(spy).toHaveBeenCalled();
    expect(component.submitRequest).toHaveBeenCalled();
  })

  it('should request the dataset with encryption', () => {
    component.selectedReport.encrypt = true;
    jest.spyOn(component,'requestDataset');
    component.requestDataset();
    expect(component.popup).toBe(true);
    expect(component.requestDataset).toHaveBeenCalled();
  })

  it('should request the dataset without encryption', () => {
    component.selectedReport.encrypt = false;
    jest.spyOn(component,'requestDataset');
    component.requestDataset();
    expect(component.showConfirmationModal).toBe(true);
    expect(component.requestDataset).toHaveBeenCalled();
  })

  it('should call selectedTabChange', () => {
    jest.spyOn(component, 'selectedTabChange');
    component.selectedTabChange({ index: 1 });
    expect(component.tabIndex).toEqual(1);
    expect(component.selectedTabChange).toHaveBeenCalled();
  })

  it('should export the report as pdf', fakeAsync(() => {
    jest.spyOn(component, 'downloadReportAsPdf').mockImplementation(() => { });
    component.downloadReport({
      value: 'pdf'
    });
    tick(1500);
    expect(component['downloadReportAsPdf']).toHaveBeenCalled();
    expect(component['downloadReportAsPdf']).toHaveBeenCalledTimes(1);
    expect(component.hideElements).toBeTruthy();
    expect(component.reportExportInProgress).toBeTruthy();
  }));

  it('should export the report as image', fakeAsync(() => {
    jest.spyOn(component, 'downloadReportAsImage').mockImplementation(() => { });
    component.downloadReport({
      value: 'img'
    });
    tick(1500);
    expect(component['downloadReportAsImage']).toHaveBeenCalled();
    expect(component['downloadReportAsImage']).toHaveBeenCalledTimes(1);
    expect(component.hideElements).toBeTruthy();
    expect(component.reportExportInProgress).toBeTruthy();
  }));

  it('should update the datasources from the reporconfig', () => {
    component.reportForm.get('solution').setValue(['01285019302823526477']);
    jest.spyOn(component,'getUpdatedParameterizedPath');
    component.getUpdatedParameterizedPath([
      {
        id: "ml_total_unique_users_api_testo_pabitra_new1",
        path: "/reports/fetch/$slug/ml_total_unique_users_api_testo_pabitra_new1.json",
      },
      {
        id: "ml_total_submissions_api_test_pabitra_new1",
        path: "/reports/fetch/$slug/ml_total_submissions_api_test_pabitra_new1.json",
      },
    ]);
    expect(component.getUpdatedParameterizedPath).toHaveBeenCalled();

  })

  it('should render the report configuration through report service',done => {
    const spy = jest.spyOn(component, 'fetchConfig')
    jest.spyOn(reportService,'listAllReports').mockReturnValue(of(mockData.reportConfig))
    jest.spyOn(component,'fetchConfig')
    component.fetchConfig({
      "reportconfig.report_type" : "program_dashboard",
      "reportconfig.solution_type" : 'project',
      "reportconfig.report_status" : "active"
  }).subscribe(res => {
    expect(res).toBeDefined;
    expect(spy).toHaveBeenCalled();
    done();
  })
  })

  it('should render the report', done => {
    const spy = jest.spyOn(component, 'renderReport')
    jest.spyOn(reportService,'listAllReports').mockReturnValue(of(mockData.reportConfig))
    jest.spyOn(reportService,'downloadMultipleDataSources').mockReturnValue(of(mockData.multipleDataDownloaded))
    jest.spyOn(reportService,'prepareChartData').mockReturnValue(mockData.charts);
    jest.spyOn(reportService,'getLatestLastModifiedOnDate').mockReturnValue(1658135572000);
    jest.spyOn(reportService,'getFormattedDate').mockReturnValue('18-July-2022');
    component.renderReport({
      "reportconfig.report_type" : "program_dashboard",
      "reportconfig.solution_type" : 'project',
      "reportconfig.report_status" : "active"
  }).subscribe(res => {
    expect(res).toBeDefined;
    expect(spy).toBeDefined();
    done();
  })
  })

  it('should not render the report', done => {
    const spy = jest.spyOn(component, 'renderReport')
    jest.spyOn(component,'fetchConfig');
    component.renderReport({
      "reportconfig.report_type" : "program_dashboard",
      "reportconfig.solution_type" : 'project',
      "reportconfig.report_status" : "active"
  })
    component.fetchConfig({
      "reportconfig.report_type" : "program_dashboard",
      "reportconfig.solution_type" : 'project',
      "reportconfig.report_status" : "active"
  }).subscribe(res => {
    expect(res).toBeUndefined
    expect(component.fetchConfig).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    done();
  })    
  })

  it('should prepare the table', () => {
    jest.spyOn(component,'prepareTableData');
    component.prepareTableData(mockData.prepTable.tablesArray,mockData.prepTable.data,mockData.prepTable.downloadUrl);
    expect(component.prepareTableData).toHaveBeenCalled();
  })

  it('should set the startDate', () => {
    jest.spyOn(component,'dateChanged');
    const isValidSpy = jest.spyOn(dayjs.prototype, 'isValid');
    isValidSpy.mockReturnValue(true);
    component.dateChanged({
      value:{
        _d:"2022-07-04T18:30:00.000Z"
      },
    },'startDate')
    expect(component.dateChanged).toHaveBeenCalled();
    isValidSpy.mockRestore();
  });

  it('should set the Date', () => {
    jest.spyOn(component,'dateChanged');
    const isValidSpy = jest.spyOn(dayjs.prototype, 'isValid');
    isValidSpy.mockReturnValue(true);
    component.dateChanged({
      value:{
        _d:"2022-07-04T18:30:00.000Z"
      },
    },'endDate')
    expect(component.dateChanged).toHaveBeenCalled();
    isValidSpy.mockRestore();
  });

  it('should call the getTableData', () => {
    jest.spyOn(component, 'getTableData')
    component.getTableData(mockData.prepTable.data,'ml_district_wise_observation_status');
    expect(component.getTableData).toHaveBeenCalled();
  });

  it('should call the getTableData', () => {
    jest.spyOn(component, 'getTableData')
    component.getTableData([mockData.prepTable.data[0]],'ml_district_wise_observation_status');
    expect(component.getTableData).toHaveBeenCalled();
  })

  it('should call closeDashboard', () => {
    jest.spyOn(component, 'closeDashboard');
    component.location = {
      back():void {}
    } as unknown as any
    component.closeDashboard();
    expect(component.closeDashboard).toHaveBeenCalled();
  });

  it('should call checkStatus', () => {
    component.selectedSolution = "607d3410e9cce45e22ce90c1"
    jest.spyOn(onDemandReportService,'isInProgress').mockReturnValue(true)
    component.onDemandReportData = mockData.onDemandReportForSolutionTest
    component.selectedReport = mockData.selectedReportForSolutionTest
    jest.spyOn(component,'checkStatus');
    component.checkStatus();
    expect(component.checkStatus).toHaveBeenCalled();
  });

  it('should call checkStatus with completed request', () => {
    component.selectedSolution = "607d3410e9cce45e22ce90c1"
    jest.spyOn(onDemandReportService,'isInProgress').mockReturnValue(false)
    component.onDemandReportData = mockData.onDemandReportForSolutionTest
    component.selectedReport = mockData.selectedReportForSolutionTest
    jest.spyOn(component,'checkStatus');
    component.checkStatus();
    expect(component.checkStatus).toHaveBeenCalled();
  });

  it('should call checkStatus with program', () => {
    component.selectedSolution = undefined;
    jest.spyOn(onDemandReportService,'isInProgress').mockReturnValue(true)
    component.onDemandReportData = mockData.onDemandReportForProgramTest
    component.selectedReport = mockData.selectedReportForProgramTest;
    jest.spyOn(component,'checkStatus');
    component.checkStatus();
    expect(component.checkStatus).toHaveBeenCalled();
  });

  it("should invalidate the end date", () => {
    jest.spyOn(component, "dateChanged");
    component.reportForm.controls.endDate.setValue(null)
    component.reportForm.controls.startDate.setValue("2023-07-10");
    const isValidSpy = jest.spyOn(dayjs.prototype, 'isValid');
    isValidSpy.mockReturnValue(true);

    component.dateChanged(
      {
        value: {
          _d: "2023-07-04T18:30:00.000Z",
        },
      },
      "endDate"
    );
    expect(component.dateChanged).toHaveBeenCalled();
    expect(component.reportForm.controls.endDate.value).toBe(null);
    isValidSpy.mockRestore();
  });

  it('should invalidate the start date', () => {
    jest.spyOn(component,'dateChanged');
    component.reportForm.controls.startDate.setValue(null)
    component.reportForm.controls.endDate.setValue('2023-07-10');
    const isValidSpy = jest.spyOn(dayjs.prototype, 'isValid');
    isValidSpy.mockReturnValue(true);
    component.dateChanged({
      value:{
        _d:"2023-07-14T18:30:00.000Z"
      },
    },'startDate')
    expect(component.dateChanged).toHaveBeenCalled();
    expect(component.reportForm.controls.startDate.value).toBe(null);
    isValidSpy.mockRestore();
  });

  it('should invalidate the date for text input', () => {
    jest.spyOn(component,'dateChanged');
    component.reportForm.controls.startDate.setValue(null);
    component.reportForm.controls.endDate.setValue(null);
    const isValidSpy = jest.spyOn(dayjs.prototype, 'isValid');
    isValidSpy.mockReturnValue(false);
    component.dateChanged({
      value:{
        _d:"abc"
      },
    },'startDate')
    expect(component.dateChanged).toHaveBeenCalled();
    expect(component.reportForm.controls.startDate.value).toBe(null);
    expect(component.reportForm.controls.endDate.value).toBe(null);
    isValidSpy.mockRestore();
  });

  it('should call ngOnDestroy', () => {
    component.userDataSubscription = of().subscribe();
    component.ngOnDestroy();
    expect(component.userDataSubscription).toBeDefined()
  });
  
});