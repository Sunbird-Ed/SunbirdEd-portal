// Import NG testing module(s)
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Import services
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { TestBed, inject } from '@angular/core/testing';
import { SearchService } from './search.service';
import { UserService } from './../user/user.service';
import { ConfigService } from '@sunbird/shared';


describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService, ContentService, UserService, LearnerService, ConfigService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should set searched content result', inject([SearchService],
    (service: SearchService) => {
      service.searchedContentList = undefined;
      const data = [{ id: 'do_123', name: 'test 1' }];
      service.setSearchedContent(data);
      expect(service).toBeTruthy();
      expect(service.searchedContentList).not.toBeUndefined();
      expect(service.searchedContentList).toEqual(data);
    }));

  it('should set searched organization result', inject([SearchService],
    (service: SearchService) => {
      service.searchedOrganisationList = undefined;
      const data = [{ id: 'do_123', name: 'Sunbird' }];
      service.setOrganisation(data);
      expect(service).toBeTruthy();
      expect(service.searchedOrganisationList).not.toBeUndefined();
      expect(service.searchedOrganisationList).toEqual(data);
    }));

  it('should return get serched content result as undefined', inject([SearchService],
    (service: SearchService) => {
      expect(service).toBeTruthy();
      const response = service.getSearchedContent();
      expect(response).toBeUndefined();
    }));

  it('should set searched content result', inject([SearchService, ContentService],
    (service: SearchService, contentService: ContentService) => {
      const params = { status: [], contetType: [], params: { userId: '', lastUpdatedOn: '' } };
      spyOn(contentService, 'post').and.callFake(() => Observable.throw({}));
      service.searchContentByUserId(params);
      expect(service).toBeTruthy();
      expect(contentService.post).toHaveBeenCalled();
    }));

  it('should be call getOrganisationDetails', inject([SearchService, ContentService],
    (service: SearchService, contentService: ContentService) => {
      const params = { orgid: ['01229679766115942443'] };
      spyOn(contentService, 'post').and.callFake(() => Observable.throw({}));
      service.getOrganisationDetails(params);
      expect(service).toBeTruthy();
      expect(contentService.post).toHaveBeenCalled();
    }));

  it('should return searched organization result as undefined', inject([SearchService],
    (service: SearchService) => {
      expect(service).toBeTruthy();
      const response = service.getOrganisation();
      expect(response).toBeUndefined();
    }));
});
