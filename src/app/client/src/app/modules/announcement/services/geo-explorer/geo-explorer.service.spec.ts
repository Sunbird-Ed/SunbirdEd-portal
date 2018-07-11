
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
// Modules
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';


// SB service(s) and module(s)
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
// import { SharedModule } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { GeoExplorerService } from './geo-explorer.service';

// Test data
import * as mockData from './geo-explorer.service.spec.data';
const testData = mockData.mockRes;

describe('GeoExplorerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoExplorerService, LearnerService, ConfigService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([GeoExplorerService], (service: GeoExplorerService) => {
    expect(service).toBeTruthy();
  }));

  it('should make api call to get locations', inject([GeoExplorerService, LearnerService], (service: GeoExplorerService,
    learner: LearnerService) => {
    spyOn(service, 'getLocations').and.callThrough();
    spyOn(learner, 'get').and.callFake(() => observableOf(testData.geoLocationSuccess));
    service.getLocations({rootOrgId: 'ORG_001'});
    expect(service).toBeTruthy();
    expect(learner.get).toHaveBeenCalled();
  }));

  it('should throw error', inject([GeoExplorerService, LearnerService], (service: GeoExplorerService, learner: LearnerService) => {
    spyOn(service, 'getLocations').and.callThrough();
    spyOn(learner, 'get').and.callFake(() => observableThrowError({}));
    service.getLocations({rootOrgId: 'ORG_001'});
    expect(service).toBeTruthy();
    expect(learner.get).toHaveBeenCalled();
  }));
});
