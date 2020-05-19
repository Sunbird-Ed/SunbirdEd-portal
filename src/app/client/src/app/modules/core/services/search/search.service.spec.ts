
import {throwError as observableThrowError,  Observable } from 'rxjs';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
// Import services
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { TestBed, inject } from '@angular/core/testing';
import { SearchService } from './search.service';
import { UserService } from './../user/user.service';
import { ConfigService, SharedModule, ResourceService } from '@sunbird/shared';
import { PublicDataService } from './../public-data/public-data.service';
import { CoreModule } from '@sunbird/core';

describe('SearchService', () => {
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        oneCourse: 'Course',
        courses: 'Courses',
      }
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CoreModule, SharedModule.forRoot()],
      providers: [SearchService, ContentService, UserService, LearnerService, ConfigService, PublicDataService,
      {provide: ResourceService, useValue: resourceBundle}]
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

    it('should call processFilterData', inject([SearchService],
      (service: SearchService) => {
        const facetData = [{
          'values': [{
            'name': 'kindergarten',
            'count': 87
          }, {
            'name': 'other',
            'count': 48
          }],
          'name': 'gradeLevel'
        }];
        const result = { 'gradeLevel': [{ 'name': 'kindergarten', 'count': 87 }, { 'name': 'other', 'count': 48 }] };
        const modifiedFacetData = service.processFilterData(facetData);
        expect(service).toBeTruthy();
        expect(modifiedFacetData).toEqual(result);
      }));

      it('should return subjects', inject([SearchService],
        (service: SearchService) => {
        const data = service.getFilterValues([{ subject: 'English'}, {subject: 'English'}, {subject: 'Social'}]);
        expect(data[0].title).toEqual('English');
        expect(data[0].count).toEqual('2 COURSES');
        expect(data[1].title).toEqual('Social');
        expect(data[1].count).toEqual('1 COURSE');
       }));

       it('should return request options with courseType', inject([SearchService],
        (service: SearchService) => {
        const data = service.getSearchRequest({filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456'}, true);
        expect(data.filters.contentType).toEqual('Course');
        expect(data.filters.courseType).toEqual('CurriculumCourse');
       }));

       it('should return request options without courseType', inject([SearchService],
        (service: SearchService) => {
        const data = service.getSearchRequest({filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456'}, false);
        expect(data.filters.contentType).toEqual(['TextBook']);
       }));


  });
