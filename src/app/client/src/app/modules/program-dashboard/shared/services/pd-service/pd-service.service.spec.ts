import { TestBed } from '@angular/core/testing';
import  * as _ from 'lodash-es';
import { mockBigChart } from '../../sb-bignumber/sb-bignumber.component.spec.data';

import { PdServiceService } from './pd-service.service';

describe('PdServiceService', () => {
  let service: PdServiceService;
  const appliedFilters =  {
    district_externalId:'2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getFilteredData', () => {
    appliedFilters['organisation_id'] = '0126796199493140480'
    jest.spyOn(service,'getFilteredData');
    service.getFilteredData(mockBigChart.chart.chartData, appliedFilters);
    expect(service.getFilteredData).toBeCalledWith(mockBigChart.chart.chartData,appliedFilters);
  })

  it('should call getFilteredData with an array type property value', () => {
    appliedFilters['organisation_id'] = ['0126796199493140480']
    jest.spyOn(service,'getFilteredData');
    const filteredData = service.getFilteredData(mockBigChart.chart.chartData, appliedFilters);
    expect(service.getFilteredData).toBeCalledWith(mockBigChart.chart.chartData,appliedFilters);
    expect(filteredData.length).toBe(1);
    expect(_.find(filteredData, mockBigChart.chart.chartData[2])).toBeTruthy();
  })

});