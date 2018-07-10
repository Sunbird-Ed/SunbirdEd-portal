
import {of as observableOf,  Observable } from 'rxjs';
// NG core modules
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
// Services
import { OrganisationService } from './organization.service';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
// Test data
import * as mockData from './organization.service.spec.data';
const testData = <any>mockData.mockRes;

describe('OrganisationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [OrganisationService, LearnerService, DashboardUtilsService, ConfigService]
    });
  });

  it('should be created', inject([OrganisationService], (service: OrganisationService) => {
    expect(service).toBeTruthy();
  }));

  it('should make api call to get org creation data', inject([OrganisationService, DashboardUtilsService, LearnerService],
    (service: OrganisationService,
      DashboardUtil: DashboardUtilsService, learnerService: LearnerService) => {
      const params = { data: { identifier: 'do_2123250076616048641482', timePeriod: '7d' }, dataset: 'ORG_CREATION' };
      const mockResponse =  testData.creationSuccessData;
      spyOn(learnerService, 'get').and.callFake(() => observableOf(mockResponse));
      service.getDashboardData(params);
      expect(service).toBeTruthy();
      expect(learnerService.get).toHaveBeenCalled();
  }));

  it('should parse org consumption api response', inject([OrganisationService, DashboardUtilsService, LearnerService],
    (service: OrganisationService,
    DashboardUtil: DashboardUtilsService, learnerService: LearnerService) => {
    const mockResponse = testData.parsedConsumptionData;
    spyOn(service, 'parseApiResponse').and.callThrough();
    const response = service.parseApiResponse(mockResponse, 'ORG_CONSUMPTION');
    expect(service).toBeTruthy();
    expect(DashboardUtil).toBeTruthy();
    expect(response.bucketData).toEqual(mockResponse.result.series);
    expect(service.parseApiResponse).not.toBeUndefined();
    expect(service.graphSeries).not.toBeUndefined();
    expect(service.graphSeries.length).toEqual(0);
    expect(response.series).toEqual('');
    expect(response.numericData.length).toBeGreaterThan(2);
  }));

  it('should parse org creation api response', inject([OrganisationService, DashboardUtilsService, LearnerService],
    (service: OrganisationService, dashboardUtil: DashboardUtilsService, learnerService: LearnerService) => {
    const mockResponse =  testData.parsedCreationData;
    spyOn(service, 'parseApiResponse').and.callThrough();
    const response = service.parseApiResponse(mockResponse, 'ORG_CREATION');
    expect(service).toBeTruthy();
    expect(dashboardUtil).toBeTruthy();
    expect(response.bucketData).toEqual(mockResponse.result.series);
    expect(service.parseApiResponse).not.toBeUndefined();
    expect(service.graphSeries).not.toBeUndefined();
    expect(response.series).not.toBeNull();
    expect(response.numericData.length).toBeGreaterThan(2);
  }));
});
