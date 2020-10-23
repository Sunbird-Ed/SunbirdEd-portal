import { mockData } from './../../../../app.component.spec.data';

import {throwError as observableThrowError,  Observable } from 'rxjs';
// Import NG testing module(s)
import { HttpClientModule } from '@angular/common/http';
// Import services
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { TestBed, inject } from '@angular/core/testing';
import { SearchService } from './search.service';
import { UserService } from './../user/user.service';
import { of } from 'rxjs';
import { ConfigService, SharedModule, ResourceService } from '@sunbird/shared';
import { PublicDataService } from './../public-data/public-data.service';
import { CoreModule, FormService } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { serviceMockData } from './search.service.spec.data';

describe('SearchService', () => {
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        oneCourse: 'Course',
        courses: 'Courses',
      }
    }
  };
  const sendSearchResult = true;
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CoreModule, SharedModule.forRoot()],
      providers: [SearchService, ContentService, UserService, LearnerService, ConfigService, PublicDataService,
        FormService, {provide: ResourceService, useValue: resourceBundle}]
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

       it('should assign filters.primaryCategory as Course', inject([SearchService],
        (service: SearchService) => {
        const data = service.getSearchRequest({filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456'}, ['Course']);
        expect(data.filters.primaryCategory[0]).toEqual('Course');
       }));

       it('should assign filters.primaryCategory as TextBook', inject([SearchService],
        (service: SearchService) => {
        const data = service.getSearchRequest({filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456'}, ['TextBook']);
        expect(data.filters.primaryCategory).toEqual(['TextBook']);
       }));
       it('should call the updateFacetsData with facets value board', () => {
        const searchService = TestBed.get(SearchService);
        const facets = [{name: 'board'}];
        const lbl = undefined;
        const obj = searchService.updateFacetsData(facets)
        expect(obj).toEqual([{name: 'board', index: '1', label: lbl, placeholder: lbl}]);
       });
       it('should call the updateFacetsData with facets value medium', () => {
        const searchService = TestBed.get(SearchService);
        const facets = [{name: 'medium'}];
        const lbl = undefined;
        const obj = searchService.updateFacetsData(facets)
        expect(obj).toEqual([{name: 'medium', index: '2', label: lbl, placeholder: lbl}]);
       });
       it('should call the updateFacetsData with facets value gradeLevel', () => {
        const searchService = TestBed.get(SearchService);
        const facets = [{name: 'gradeLevel'}];
        const lbl = undefined;
        const obj = searchService.updateFacetsData(facets)
        expect(obj).toEqual([{name: 'gradeLevel', index: '3', label: lbl, placeholder: lbl}]);
       });
       it('should call the updateFacetsData with facets value subject', () => {
        const searchService = TestBed.get(SearchService);
        const facets = [{name: 'subject'}];
        const lbl = undefined;
        const obj = searchService.updateFacetsData(facets)
        expect(obj).toEqual([{name: 'subject', index: '4', label: lbl, placeholder: lbl}]);
       });
       it('should call the updateFacetsData with facets value publisher', () => {
        const searchService = TestBed.get(SearchService);
        const facets = [{name: 'publisher'}];
        const lbl = undefined;
        const obj = searchService.updateFacetsData(facets)
        expect(obj).toEqual([{name: 'publisher', index: '5', label: lbl, placeholder: lbl}]);
       });
       it('should call the updateFacetsData with facets value contentType', () => {
        const searchService = TestBed.get(SearchService);
        const facets = [{name: 'primaryCategory'}];
        const lbl = undefined;
        const obj = searchService.updateFacetsData(facets);
        expect(obj).toEqual([{name: 'primaryCategory', index: '6', label: lbl, placeholder: lbl}]);
       });
       it('should call the getSubjectsStyles', () => {
        const searchService = TestBed.get(SearchService);
        const obj = searchService.getSubjectsStyles();
        expect(obj).toEqual(serviceMockData.returnValue);
       });
       it('should call the getContentTypes', () => {
        const searchService = TestBed.get(SearchService);
        const formService = TestBed.get(FormService);
        spyOn(formService, 'getFormConfig').and.returnValue(of(serviceMockData.formData));
        searchService.getContentTypes();
       });
       it('should assign filters.contentType as Course', inject([SearchService],
        (service: SearchService) => {
        const data = service.fetchCourses({filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456'}, ['Course']);
        spyOn(service, 'contentSearch').and.callFake(() => {
          if (sendSearchResult) {
            return of(serviceMockData.successData);
          }
          return observableThrowError({});
        });
      }));

    it ('should return TRUE (when content is trackable or contentType = COURSE)', inject([SearchService],
      (service: SearchService) => {
        const value = service.isContentTrackable({identifier: '123', trackable: {enabled: 'yes'}}, 'course');
        expect(value).toBe(true);
    }));

    it ('should return FALSE (when content is not trackable or contentType != COURSE)', inject([SearchService],
      (service: SearchService) => {
        const value = service.isContentTrackable({identifier: '123', trackable: {enabled: 'no'}}, 'resource');
        expect(value).toBe(false);
    }));

  });
