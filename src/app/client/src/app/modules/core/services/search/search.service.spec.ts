
import {throwError as observableThrowError,  Observable } from 'rxjs';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
// Import services
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { TestBed, inject } from '@angular/core/testing';
import { SearchService } from './search.service';
import { UserService } from './../user/user.service';
import { ConfigService } from '@sunbird/shared';
import { PublicDataService } from './../public-data/public-data.service';


describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SearchService, ContentService, UserService, LearnerService, ConfigService, PublicDataService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should set searched content result', inject([SearchService, ContentService],
    (service: SearchService, contentService: ContentService) => {
      const params = { status: [], contetType: [], params: { userId: '', lastUpdatedOn: '' } };
      spyOn(contentService, 'post').and.callFake(() => observableThrowError({}));
      service.searchContentByUserId(params);
      expect(service).toBeTruthy();
      expect(contentService.post).toHaveBeenCalled();
    }));

  xit('should call getOrganisationDetails', inject([SearchService, ContentService],
    (service: SearchService, publicDataService: PublicDataService) => {
      const params = { orgid: ['01229679766115942443'] };
      spyOn(publicDataService, 'post').and.callFake(() => observableThrowError({}));
      service.getOrganisationDetails(params);
      expect(service).toBeTruthy();
      expect(publicDataService.post).toHaveBeenCalled();
    }));
});
