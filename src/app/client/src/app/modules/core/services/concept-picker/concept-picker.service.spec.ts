import { ContentService } from './../content/content.service';
import { TestBed, inject } from '@angular/core/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from './../search/search.service';
import { UserService } from './../user/user.service';
import { LearnerService } from './../learner/learner.service';
import { Observable } from 'rxjs/Observable';
import { SearchParam } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { ConfigService, ResourceService, ToasterService} from '@sunbird/shared';
import { ConceptPickerService } from './concept-picker.service';
import {mockRes} from './concept-picker.service.spec.data';
describe('ConceptPickerService', () => {
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0015': 'Fetching content detail failed, please try again later...'
      }
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      providers: [ConceptPickerService, SearchService, UserService, ConfigService, LearnerService,
        ToasterService, ContentService, { provide: ResourceService, useValue: resourceBundle }]
    });
  });
  it('should be created', inject([ConceptPickerService, SearchService, ContentService], (service: ConceptPickerService,
    searchService: SearchService, contentService: ContentService) => {
      spyOn(service, 'getConcept').and.callThrough();
      spyOn(contentService, 'post').and.callFake(() => Observable.of(mockRes.conceptData));
      service.getConcept(0, 200);
      expect(service).toBeTruthy();
      expect(contentService.post).toHaveBeenCalled();
  }));
  it('should be created', inject([ConceptPickerService, SearchService, ContentService], (service: ConceptPickerService,
    searchService: SearchService, contentService: ContentService) => {
      spyOn(service, 'loadDomains').and.callThrough();
      spyOn(contentService, 'post').and.callFake(() => Observable.of(mockRes.domainData));
      service.loadDomains();
      expect(service).toBeTruthy();
      expect(contentService.post).toHaveBeenCalled();
  }));
});
