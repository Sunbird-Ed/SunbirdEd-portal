import { TestBed, inject } from '@angular/core/testing';
import { DashboardUtilsService } from './dashboard-utils.service';

describe('DashboardUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardUtilsService]
    });
  });

  it('should be created', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return zero second', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = { 'value': 12 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('12 Second');
  }));

  it('should return value in a min', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = { 'value': 120 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('2 minutes');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = { 'value': 3601 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('1 Hour');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = {};
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response).toEqual(numericRes);
  }));
});
