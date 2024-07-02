import { throwError as observableThrowError } from 'rxjs';
import { LearnerService } from './../learner/learner.service';
import { ContentService } from './../content/content.service';
import { SearchService } from './search.service';
import { UserService } from './../user/user.service';
import { of } from 'rxjs';
import { ConfigService, ResourceService } from '../../../shared';
import { PublicDataService } from './../public-data/public-data.service';
import { FormService } from '../../../core';
import { serviceMockData } from './search.service.spec.data';

describe('SearchService', () => {
  let searchService: SearchService;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        oneCourse: 'Course',
        courses: 'Courses',
      }
    }
  };

  const mockUserService: Partial<UserService> = {
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
  };

  const mockContentService: Partial<ContentService> = {
    post: jest.fn(() => of({})) as any
  };

  const mockLearnerService: Partial<LearnerService> = {};

  const mockPublicDataService: Partial<PublicDataService> = {
    post: jest.fn(() => of({})) as any
  };

  const mockFormService: Partial<FormService> = {};

  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        CONTENT: {
          SEACRH: 'search'
        },
        ADMIN: {
          ORG_EXT_SEARCH: 'org-ext-search'
        }
      }
    },
    appConfig: {
      ExplorePage: {
        contentApiQueryParams: {
          orgdetails: 'orgName,email'
        }
      },
      contentType: {
        Course: "Course"
      },
    }
  };

  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        oneCourse: 'COURSE'
      }
    }
  };

  beforeAll(() => {
    searchService = new SearchService(
      mockUserService as UserService,
      mockContentService as ContentService,
      mockConfigService as ConfigService,
      mockLearnerService as LearnerService,
      mockPublicDataService as PublicDataService,
      mockResourceService as ResourceService,
      mockFormService as FormService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(searchService).toBeTruthy();
  });

  it('should set searched content result', () => {
    const params = { status: [], contetType: [], params: { userId: '', lastUpdatedOn: '' } };
    jest.spyOn(mockContentService, 'post').mockReturnValue(observableThrowError({}));
    searchService.searchContentByUserId(params);
    expect(searchService).toBeTruthy();
    expect(mockContentService.post).toHaveBeenCalled();
  });

  it('should call getOrganisationDetails', () => {
    const params = { orgid: ['01229679766115942443'] };
    jest.spyOn(mockPublicDataService, 'post').mockReturnValue(observableThrowError({}));
    searchService.getOrganisationDetails(params);
    expect(searchService).toBeTruthy();
    expect(mockPublicDataService.post).toHaveBeenCalled();
  });

  it('should call processFilterData', () => {
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
    const modifiedFacetData = searchService.processFilterData(facetData);
    expect(searchService).toBeTruthy();
    expect(modifiedFacetData).toEqual(result);
  });

  it('should return subjects', () => {
    const data = searchService.getFilterValues([{ subject: 'English' }, { subject: 'English' }, { subject: 'Social' }]);
    expect(data[0].title).toEqual('English');
    expect(data[1].title).toEqual('Social');
  });

  it('should assign filters.primaryCategory as Course', () => {
    const data = searchService.getSearchRequest({ filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456' }, ['Course']);
    expect(data.filters.primaryCategory[0]).toEqual('Course');
  });

  it('should assign filters.primaryCategory as TextBook', () => {
    const data = searchService.getSearchRequest({ filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456' }, ['TextBook']);
    expect(data.filters.primaryCategory).toEqual(['TextBook']);
  });

  describe('should check for update facets data', () => {

    it('should call the updateFacetsData with facets value board', () => {
      const facets = [{ name: 'board' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'board', index: '2', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value board for cbse', () => {
      const facets = [{ name: 'board', values: [{ name: 'CBSE' }] }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'board', index: '2', label: lbl, placeholder: lbl, values: [{ name: 'CBSE' }] }]);
    });

    it('should call the updateFacetsData with facets value medium', () => {
      const facets = [{ name: 'medium' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'medium', index: '3', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value gradeLevel', () => {
      const facets = [{ name: 'gradeLevel' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'gradeLevel', index: '4', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value subject', () => {
      const facets = [{ name: 'subject' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'subject', index: '5', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value publisher', () => {
      const facets = [{ name: 'publisher' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'publisher', index: '6', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value primaryCategory', () => {
      const facets = [{ name: 'primaryCategory' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'primaryCategory', index: '7', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value mimeType', () => {
      const facets = [{ name: 'mimeType' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'mediaType', index: '8', label: lbl, placeholder: lbl, mimeTypeList: undefined }]);
    });

    it('should call the updateFacetsData with facets value mediaType', () => {
      const facets = [{ name: 'mediaType' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'mediaType', index: '8', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value audience', () => {
      const facets = [{ name: 'audience' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'audience', index: '9', label: lbl, placeholder: lbl }]);
    });

    it('should call the updateFacetsData with facets value channel', () => {
      const facets = [{ name: 'channel' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'channel', index: '1', label: lbl, placeholder: lbl, values: [] }]);
    });

    it('should call the updateFacetsData with facets value additionalCategories', () => {
      const facets = [{ name: 'additionalCategories' }];
      const lbl = undefined;
      const obj = searchService.updateFacetsData(facets);
      expect(obj).toEqual([{ name: 'additionalCategories', index: '71', label: lbl, placeholder: lbl }]);
    });

  });

  it('should call the getSubjectsStyles', () => {
    const obj = searchService.getSubjectsStyles();
    expect(obj).toEqual(serviceMockData.returnValue);
  });

  it('should call the getContentTypes', () => {
    mockFormService.getFormConfig = jest.fn().mockImplementation(() => of(serviceMockData.formData))
    jest.spyOn(searchService, 'getContentTypes');
    searchService.getContentTypes();
    expect(mockFormService.getFormConfig).toHaveBeenCalled();
    expect(searchService.getContentTypes).toHaveBeenCalled();
  });

  it('should assign filters.contentType as Course', () => {
    const data = searchService.fetchCourses({ filters: {}, isCustodianOrg: false, channelId: '123', frameworkId: '123456' }, ['Course']);
    jest.spyOn(searchService, 'contentSearch').mockReturnValue(observableThrowError({}));
  });

  it('should return TRUE (when content is trackable or contentType = COURSE)', () => {
    const value = searchService.isContentTrackable({ identifier: '123', trackable: { enabled: 'yes' } }, 'course');
    expect(value).toBe(true);
  });

  it('should return FALSE (when content is not trackable or contentType != COURSE)', () => {
    const value = searchService.isContentTrackable({ identifier: '123', trackable: { enabled: 'no' } }, 'resource');
    expect(value).toBe(false);
  });

  it('should call the updateOption method with data', () => {
    const obj = serviceMockData.option;
    const newObj = searchService.updateOption(obj);
  });

});
