import { ResourceService, ToasterService } from '../../services';
import { OnDemandReportService } from '../../services/on-demand-report/on-demand-report.service';
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
import { of, throwError } from 'rxjs';
import { MockData } from './on-demand-report.component.spec.data'
import { OnDemandReportsComponent } from './on-demand-reports.component';

describe('OnDemandReportsComponent', () => {
  let component: OnDemandReportsComponent
  const mockResourceService: Partial<ResourceService> = {
    messages: { fmsg: { m0004: 'Could not fetch data, try again later' } }
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    interact:jest.fn()
  };
  const mockOnDemandReportService: Partial<OnDemandReportService> = {
    getReportList: jest.fn(),
    getReport:jest.fn(),
    submitRequest:jest.fn()
  };
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn()
  };
  beforeAll(() => {
    component = new OnDemandReportsComponent(
      mockResourceService as ResourceService,
      mockTelemetryService as TelemetryService,
      mockOnDemandReportService as OnDemandReportService,
      mockToasterService as ToasterService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be create a instance of OnDemandReportsComponent Component', () => {
    expect(component).toBeTruthy();
  });
  it('should create component and call the ngOninit method', () => {
    component.ngOnInit();
    expect(component.instance).toEqual('SUNBIRD');
  });
  it('should create component and call the loadReports method', () => {
    jest.spyOn(mockOnDemandReportService, 'getReportList').mockReturnValue(of(MockData.reportListResult1)).mockReturnValueOnce(of(MockData.reportListResult2))
    component.loadReports(MockData.batchDetails);
    expect(component.instance).toEqual('SUNBIRD');
    expect(component.onDemandReportData).toEqual(MockData.reportListResult2.result.jobs)
  });
  it('should create component and call the loadReports method with error', () => {
    jest.spyOn(mockOnDemandReportService, 'getReportList').mockReturnValue(throwError({ error: 'error' }));
    component.loadReports(MockData.batchDetails);
    expect(component.instance).toEqual('SUNBIRD');
    expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0004);
  });
  it('should create component and call the reportChanged method with ev', () => {
    component.reportChanged({value:'abcd'});
    expect(component.instance).toEqual('SUNBIRD');
    expect(component.selectedReport).toEqual('abcd');
  });
  it('should create component and call the generateTelemetry method with data', () => {
    component.generateTelemetry('test','01355879219098419215', 'do_31349157970036326411459');
    expect(component.instance).toEqual('SUNBIRD');
    expect(mockTelemetryService.interact).toBeCalled();
  });
  it('should create component and call the onDownloadLinkFail method with data', () => {
    jest.spyOn(mockOnDemandReportService, 'getReport').mockReturnValue(of(MockData.reportListResult1)).mockReturnValueOnce(of(MockData.reportListResult2));
    window.open = jest.fn();
    component.onDownloadLinkFail(MockData.reportListResult1.result.jobs);
    expect(component.instance).toEqual('SUNBIRD');
    expect(window.open).toBeCalledWith('https://sunbirdstagingprivate.blob.core.windows.net/reports/ml_reports/ml-project-status-exhaust/4FBA324F313FFEF101A0A8D2B5F263F3_20221115.zip?sv=2017-04-17&se=2023-04-13T07%3A35%3A03Z&sr=b&sp=r&sig=uBDPfQy0LmcKZkpGVq0rK6BAtYLXXp%2BrScSZPL/0WXQ%3D', '_blank');
  });
  it('should create component and call the onDownloadLinkFail method with data without downloadURL', () => {
    jest.spyOn(mockOnDemandReportService, 'getReport').mockReturnValue(of(MockData.reportListResult1)).mockReturnValueOnce(of(MockData.reportListResult1));
    window.open = jest.fn();
    component.onDownloadLinkFail(MockData.reportListResult1.result.jobs);
    expect(component.instance).toEqual('SUNBIRD');
    expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0004);
  });
  it('should create component and call the onDownloadLinkFail method with error', () => {
    jest.spyOn(mockOnDemandReportService, 'getReport').mockReturnValue(throwError({error:'error'}));
    window.open = jest.fn();
    component.onDownloadLinkFail(MockData.reportListResult1.result.jobs);
    expect(component.instance).toEqual('SUNBIRD');
    expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0004);
  });
  it('should create component and call the submitRequest method ', () => {
    jest.spyOn(mockOnDemandReportService, 'submitRequest').mockReturnValue(of(MockData.reportListResult2));
    component.selectedReport = {jobId: 'jobId', encrypt: 'true'};
    component.submitRequest();
    expect(component.instance).toEqual('SUNBIRD');
    expect(component.onDemandReportData).toBeDefined();
  });

});