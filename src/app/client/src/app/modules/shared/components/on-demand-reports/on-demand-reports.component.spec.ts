import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ToasterService, ResourceService, ConfigService} from '../../services';
import {OnDemandReportService} from '../../services/on-demand-report/on-demand-report.service';
import {SuiModule} from 'ng2-semantic-ui';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SbDatatableComponent} from '../sb-datatable/sb-datatable.component';
import {OnDemandReportsComponent} from './on-demand-reports.component';
import {throwError, of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MockData} from './on-demand-report.component.spec.data';
import { ReactiveFormsModule } from '@angular/forms';
import {SbDataTablePipe} from '../../pipes/sb-data-table-pipe/sb-data-table.pipe';
import {InterpolatePipe} from '../../pipes/interpolate/interpolate.pipe';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';

describe('OnDemandReportsComponent', () => {
  const resourceBundle = {
    'messages': {
      'fmsg': {m0004: 'm0004'},
      'stmsg': {},
      'smsg': {}
    },
    frmelmnts: {lbl: {requestFailed: 'requestFailed'}}
  };
  let component: OnDemandReportsComponent;
  let fixture: ComponentFixture<OnDemandReportsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnDemandReportsComponent, SbDatatableComponent, SbDataTablePipe, InterpolatePipe],
      imports: [SuiModule, FormsModule, NgxDatatableModule, HttpClientTestingModule, ReactiveFormsModule,
        TelemetryModule.forRoot()],
      providers: [ToasterService, OnDemandReportService, HttpClient, ConfigService, TelemetryService,
        {provide: ResourceService, useValue: resourceBundle}
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OnDemandReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init instance', () => {
    component.ngOnInit();
    expect(component.instance).toEqual('SUNBIRD');
  });

  it('should set data on report change', () => {
    component.reportChanged(MockData.data);
    expect(component.selectedReport).toEqual(MockData.data);
  });
  it('should load report', () => {
    component.tag = 'mockTag';
    component.batch = {
      batchId: 'batchId'
    };
    const onDemandReportService = TestBed.get(OnDemandReportService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(of(MockData.reportListResponse));
    component.loadReports('do_21310064620881510413775_01310067114129817611');
    expect(component.onDemandReportData).toEqual(MockData.reportListResponse.result.jobs);
  });
  it('should throw error if not load report', () => {
    component.tag = 'mockTag';
    component.batch = {
      batchId: 'batchId'
    };
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.loadReports('do_21310064620881510413775_01310067114129817611');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });
  it('should throw error if not onDownloadLinkFail', () => {
    component.tag = 'mockTag';
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'getReport').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.onDownloadLinkFail({tag: 'mockTag', requestId: 'mockId'});
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });
  it('should not throw error on onDownloadLinkFail', () => {
    component.tag = 'mockTag';
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'getReport').and.returnValue(of({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.onDownloadLinkFail({tag: 'mockTag', requestId: 'mockId'});
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });
  it('should throw error if not submitRequest', () => {
    component.tag = 'mockTag';
    component.batch = {
      batchId: 'batchId'
    };
    component.onDemandReportData = MockData.reportListResponse.result.jobs;
    component.userId = 'userId';
    component.selectedReport = {jobId: 'jobId'};
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'submitRequest').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.submitRequest();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.requestFailed);
  });
  it('should populate data as submit request succeess', () => {
    component.tag = 'mockTag';
    component.batch = {
      batchId: 'batchId'
    };
    component.userId = 'userId';
    component.selectedReport = {jobId: 'jobId'};
    component.onDemandReportData = [{1: 'a'}];
    component.reportTypes = MockData.reportTypes;
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'submitRequest').and.returnValue(of({result: {2: 'b', dataset: 'response-exhaust'}}));
    spyOn(toasterService, 'error').and.callThrough();
    component.submitRequest();
    expect(component.onDemandReportData).toEqual([{
      2: 'b', dataset: 'response-exhaust',
      title: 'Question set report'
    }, {1: 'a'}]);
  });

  it('should populate data and show toaster message as request failed', () => {
    component.tag = 'mockTag';
    component.batch = {
      batchId: 'batchId'
    };
    component.userId = 'userId';
    component.selectedReport = {jobId: 'jobId'};
    component.onDemandReportData = [{1: 'a'}];
    component.reportTypes = MockData.reportTypes;
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'submitRequest').and.returnValue(of(MockData.mockSubmitReqData));
    spyOn(toasterService, 'error').and.callThrough();
    component.submitRequest();
    expect(component.onDemandReportData).toEqual([{
      2: 'b', dataset: 'response-exhaust',
      title: 'Question set report',
      status: 'FAILED', statusMessage: 'statusMessage'
    }, {1: 'a'}]);
    expect(toasterService.error).toHaveBeenCalledWith(MockData.mockSubmitReqData.result.statusMessage);
  });

  it('should call checkStatus and user can create new report', () => {
    component.selectedReport = MockData.selectedReport;
    MockData.responseData.result.jobs[0]['status'] = 'SUCCESS';
    component.onDemandReportData = MockData.responseData.result.jobs;
    component.batch = {endDate: "2020-10-25"};
    const result = component.checkStatus();
    expect(result).toBeTruthy();
  });

  it('should call checkStatus and can not create report and it is in SUBMITTED state', () => {
    component.selectedReport = MockData.selectedReport;
    MockData.responseData.result.jobs[0]['status'] = 'SUBMITTED';
    component.onDemandReportData = MockData.responseData.result.jobs;
    component.batch = {endDate: null};
    const result = component.checkStatus();
    expect(result).toBeFalsy();
  });

  it('should call checkStatus and can not create report and it is in PROCESSING state', () => {
    component.selectedReport = MockData.selectedReport;
    MockData.responseData.result.jobs[0]['status'] = 'PROCESSING';
    component.onDemandReportData = MockData.responseData.result.jobs;
    component.batch = {endDate: null};
    const result = component.checkStatus();
    expect(result).toBeFalsy();
  });

  it('should call dataModification', () => {
    const row = {dataset: 'progress-exhaust'};
    component.reportTypes = MockData.reportTypes;
    const result = component.dataModification(row);
    expect(result.title).toBe('Course progress exhaust');
  });
  it('should call dataModification', () => {
    const row = {dataset: 'userinfo-exhaust'};
    component.reportTypes = MockData.reportTypes;
    const result = component.dataModification(row);
    expect(result.title).toBe('User profile exhaust');
  });
  it('should call dataModification', () => {
    const row = {dataset: 'response-exhaust'};
    component.reportTypes = MockData.reportTypes;
    const result = component.dataModification(row);
    expect(result.title).toBe('Question set report');
  });

  it('should generate telemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.generateTelemetry('response-exhaust', 'batchId', 'courseId');
    expect(telemetryService.interact).toHaveBeenCalled();
    expect(telemetryService.interact).toHaveBeenCalledWith(MockData.telemetryObj);
  });

});
