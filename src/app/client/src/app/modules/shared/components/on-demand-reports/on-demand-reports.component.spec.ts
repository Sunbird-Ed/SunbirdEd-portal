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
describe('OnDemandReportsComponent', () => {
  const resourceBundle = {
    'messages': {
      'fmsg': {m0004: 'm0004'},
      'stmsg': {},
      'smsg': {}
    }
  };
  let component: OnDemandReportsComponent;
  let fixture: ComponentFixture<OnDemandReportsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnDemandReportsComponent, SbDatatableComponent],
      imports: [SuiModule, FormsModule, NgxDatatableModule, HttpClientTestingModule],
      providers: [ToasterService, OnDemandReportService, HttpClient, ConfigService,
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
  it('should set data on report change', () => {
    component.reportChanged(MockData.data);
    expect(component.reportType).toEqual(MockData.data);
  });
  it('should load report on ngoninit', () => {
    component.tag = 'mockTag';
    const onDemandReportService = TestBed.get(OnDemandReportService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(of(MockData.reportListResponse));
    component.ngOnInit();
    expect(component.onDemandReportData).toEqual(MockData.reportListResponse.result.jobs);
  });
  it('should throw error if not load report on ngoninit', () => {
    component.tag = 'mockTag';
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'getReportList').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
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
    component.userId = 'userId';
    component.reportType = {jobId: 'jobId'};
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'submitRequest').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.submitRequest();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });
  it('should populate data as submit request succeess', () => {
    component.tag = 'mockTag';
    component.batch = {
      batchId: 'batchId'
    };
    component.userId = 'userId';
    component.reportType = {jobId: 'jobId'};
    component.onDemandReportData = [{1: 'a'}];
    const onDemandReportService = TestBed.get(OnDemandReportService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(onDemandReportService, 'submitRequest').and.returnValue(of({result: {2: 'b'}}));
    spyOn(toasterService, 'error').and.callThrough();
    component.submitRequest();
    expect(component.onDemandReportData).toEqual([{2: 'b'}, {1: 'a'}]);
  });
});