// Import NG testing module(s)
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
      imports: [HttpClientModule],
      providers: [SearchService, ContentService, UserService, LearnerService, ConfigService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
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
});
