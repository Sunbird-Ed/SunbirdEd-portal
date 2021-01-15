import { of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { DashboardModule } from '@sunbird/dashboard';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetComponent } from './dataset.component';
import { CoreModule } from '@sunbird/core';
import { ReportService, DatasetService } from '../../services';
import { mockDatasetConfig } from './dataset.component.spec.data';
import dayjs from 'dayjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('DatasetComponent', () => {
  let component: DatasetComponent;
  let fixture: ComponentFixture<DatasetComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      params: { reportId: 'daily_metrics' },
      queryParams: { materialize: false },
      data:
        { telemetry: { pageid: 'org-admin-dashboard', env: 'dashboard', type: 'view' } }
    }
  };

  const resourceServiceMockData = {
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        submit: 'Submit',
        edit: 'Edit',
        noDataAvailable: 'No data available',

      }
    }
  };

  beforeEach(async(() => {
    configureTestSuite();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), DashboardModule],
      providers: [
        ReportService, DatasetService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.dataset = mockDatasetConfig;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set markdown data', () => {
    component['setMarkdowns']();
    expect(component.dataDictionary).toBe(`# Dataset Examples Markdown`);
    expect(component.examples).toBe('');
  });

  it('should handle error while setting markdown data', () => {
    component.dataset.dataDictionary = '1';
    component['setMarkdowns']();
    expect(component.dataDictionary).toBe(``);
    expect(component.examples).toBe('');
  });

  it('should fetch dataset, by default last 7 days', done => {
    const datasetService = TestBed.get(DatasetService);
    spyOn(datasetService, 'getDataSet').and.returnValue(of({ files: [], periodWiseFiles: {} }));
    component['getDataset']({
      from: dayjs('2020-12-01'),
      to: dayjs('2020-12-02')
    }).subscribe(res => {
      expect(datasetService.getDataSet).toHaveBeenCalledWith({ datasetId: 'raw', from: '2020-12-01', to: '2020-12-02' });
      expect(res).toEqual(
        [
          {
            'date': '2020-12-01',
            'json': [],
            'csv': []
          },
          {
            'date': '2020-12-02',
            'json': [],
            'csv': []
          }
        ]);
      done();
    });
  });

  it('should get date range in between 2 selected dates', () => {
    const startDate = dayjs('2020-12-01');
    const endDate = dayjs('2020-12-03');
    const result = component['getDateRange'](startDate, endDate);
    expect(result).toEqual(['2020-12-01', '2020-12-02', '2020-12-03']);
    expect(result.length).toBe(3);
  });

  it('should divide date range into chunks', () => {
    const dates = ['2020-08-22', '2020-08-23', '2020-08-24'];
    const result = component['getDateChunks'](dates);
    expect(result).toEqual([['2020-08-22', '2020-08-24']]);
  });

  it('should handle on submit button click handler', () => {
    component.timeRangePicker.setValue({ from: '', to: '' });
    const spy = spyOn(component['customTimePicker'], 'next');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith({ from: '', to: '' });
  });

  it('should handle markdown submission', () => {
    component.examples = 'examples';
    component['markdownUpdated$'] = new Subject();
    const spy = spyOn(component['markdownUpdated$'], 'next');
    component.handleMarkdownSubmission('examples');
    expect(spy).toHaveBeenCalledWith({ data: 'examples', type: 'examples' });
  });

});
