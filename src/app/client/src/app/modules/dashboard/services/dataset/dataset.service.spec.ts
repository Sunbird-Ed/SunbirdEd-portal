import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, BaseReportService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TestBed } from '@angular/core/testing';

import { DatasetService } from './dataset.service';
import { of } from 'rxjs';

describe('DatasetService', () => {
  let datasetService: DatasetService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule]
  }));

  beforeEach(() => {
    datasetService = TestBed.get(DatasetService);
  });

  it('should be created', () => {
    const service: DatasetService = TestBed.get(DatasetService);
    expect(service).toBeTruthy();
  });

  it('should fetch dataset if called without headers', done => {
    const baseReportService = TestBed.get(BaseReportService);
    const input = { datasetId: 'raw', from: '2020-12-01', to: '2020-12-03' };
    const spy = spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    datasetService.getDataSet(input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toEqual({});
      expect(spy).toHaveBeenCalledWith({
        url: '/dataset/get/raw?from=2020-12-01&to=2020-12-03'
      });
      done();
    });
  });

  it('should fetch dataset if called with headers', done => {
    const baseReportService = TestBed.get(BaseReportService);
    const input = { datasetId: 'raw', from: '2020-12-01', to: '2020-12-03', header: { ['X-Channel-Id']: '123' } };
    const spy = spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    datasetService.getDataSet(input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toEqual({});
      expect(spy).toHaveBeenCalledWith({
        url: '/dataset/get/raw?from=2020-12-01&to=2020-12-03',
        header: {
          ['X-Channel-Id']: '123'
        }
      });
      done();
    });
  });

});
