import { ResourceService, ConfigService, ToasterService, NavigationHelperService, PaginationService } from '../../../shared';
import { LearnerService, CoursesService, SearchService, PlayerService, FormService } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewAllComponent } from './view-all.component';
import { throwError as observableThrowError, of as observableOf, Observable, of } from 'rxjs';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { Location } from '@angular/common';
import { BrowserCacheTtlService, LayoutService, UtilService } from '../../../shared';
import { OrgDetailsService, UserService } from '../../../core';
import { Response } from './view-all.component.spec.data';

describe('ViewAllComponent', () => {
  let component: ViewAllComponent;

  const mockSearchService: Partial<SearchService> = {};
  const mockPlayerService: Partial<PlayerService> = {
    playContent: jest.fn()
  };
  const mockFormService: Partial<FormService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({
      selectedTab: 'all',
      contentType: ['Course'], objectType: ['Content'], status: ['Live'],
      defaultSortBy: JSON.stringify({ lastPublishedOn: 'desc' })
    })
  };
  const mockCoursesService: Partial<CoursesService> = {
    findEnrolledCourses: () => {
      return {
        'onGoingBatchCount': 0,
        'expiredBatchCount': 0,
        'openBatch': {
          'ongoing': [],
          'expired': []
        },
        'inviteOnlyBatch': {
          'ongoing': [],
          'expired': []
        }
      }
    }
  };
  const mockPaginationService: Partial<PaginationService> = {
    getPager: jest.fn()
  };
  const mockPublicPlayerService: Partial<PublicPlayerService> = {};
  const mockRouter: Partial<Router> = {
    url: '/resources/view-all/Course-Unit/1',
    navigate: jest.fn()
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    getPreviousUrl: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockUtilService: Partial<UtilService> = {
    processContent: jest.fn()
  };
  const mockOrgDetailsService: Partial<OrgDetailsService> = {
    searchOrgDetails: jest.fn(() => of(Response.orgDetails))
  };
  const mockUserService: Partial<UserService> = {
    // userData$: {
    //   userProfile: {
    //     userId: 'sample-uid',
    //     rootOrgId: 'sample-root-id',
    //     rootOrg: {},
    //     hashTagIds: ['id']
    //   }
    // } as any,
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockConfigService: Partial<ConfigService> = {
    dropDownConfig: {
      FILTERS: {
        RESOURCES: {
          sortingOptions: jest.fn(),
        }
      }
    },
    appConfig: {
      ViewAll: {
        PAGE_LIMIT: 1,
        otherCourses: {
          constantData: {
            'action': {
              'onImage': {
                'eventName': 'onImage'
              }
            }
          }
        }
      }
    }
  };
  const mockLayoutService: Partial<LayoutService> = {
    isLayoutAvailable: jest.fn(() => true)
  };

  beforeAll(() => {
    component = new ViewAllComponent(
      mockSearchService as SearchService,
      mockRouter as Router,
      mockPlayerService as PlayerService,
      mockFormService as FormService,
      mockActivatedRoute as ActivatedRoute,
      mockPaginationService as PaginationService,
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
      mockPublicPlayerService as PublicPlayerService,
      mockConfigService as ConfigService,
      mockCoursesService as CoursesService,
      mockUtilService as UtilService,
      mockOrgDetailsService as OrgDetailsService,
      mockUserService as UserService,
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockNavigationHelperService as NavigationHelperService,
      mockLayoutService as LayoutService,
    );

  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of View All Component', () => {
    expect(component).toBeTruthy();
  });

  // it('should call ngOninit when content is present', () => {
  //   component.queryParams = {
  //     viewMore: true,
  //     content: JSON.stringify(Response.successData.result.content[0])
  //   };
  //   jest.spyOn(component, 'setTelemetryImpressionData').mockImplementation(() => { });
  //   jest.spyOn(component, 'setInteractEventData').mockImplementation(() => { });
  //   mockLayoutService.initlayoutConfig = jest.fn(() => { });
  //   mockLayoutService.redoLayoutCSS = jest.fn(() => {
  //     return 'sb-g-col-xs-12';
  //   });
  //   mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
  //   mockOrgDetailsService.getOrgDetails = jest.fn().mockReturnValue(of({})) as any;
  //   component.setTelemetryImpressionData = jest.fn();
  //   component.ngOnInit();
  //   component.setTelemetryImpressionData();
  //   expect(component).toBeTruthy();
  //   expect(component.setTelemetryImpressionData).toHaveBeenCalled();
  // });

  it('should call get filters method', () => {
    const filters = {
      'status': 'FETCHED',
      'filters': {
        'selectedTab': 'all',
        'channel': [
          'Chhattisgarh'
        ]
      }
    };
    component.facets = Response.facets;
    component.getFilters(filters);
    expect(component.selectedFilters).toEqual(
      {
        'channel': ['Chhattisgarh'],
        'selectedTab': 'all'
      }
    )
  });

  it('should call manipulateQueryParam method', (done) => {
    const results = {
      'defaultSortBy': '{\'lastPublishedOn\':\'desc\'}',
      'primaryCategory': 'Course',
      'selectedTab': 'all',
      'appliedFilters': 'true'
    };
    component['manipulateQueryParam'](results);
    setTimeout(() => {
      expect(component.filters).toEqual({ primaryCategory: 'Course' });
      done();
    });
  });

  it('should call fetch Org Data method', () => {
    mockOrgDetailsService.searchOrgDetails = jest.fn().mockReturnValue(of(Response.orgDetails)) as any;
    component.fetchOrgData(Response.contentData).subscribe((res) => {
      expect(res).toEqual(Response.orgDetails);
    });
  });

  it('should process the data if view-all is clicked from My-Courses section', () => {
    component.sectionName = 'My Enrolled Collection';
    const sortedData = _.map(_.orderBy(_.get(Response, 'enrolledCourseData.enrolledCourses'), ['enrolledDate'], ['desc']), (val) => {
      const value = _.get(val, 'content');
      return value;
    });
    // @ts-ignore
    jest.spyOn(component, 'getContentList').mockImplementation(() => of({
      'enrolledCourseData': Response.enrolledCourseData,
      'contentData': Response.successData,
      'currentPageData': { contentType: 'Course', search: { filters: { primaryCategory: [] } } }
    }));
    component.getContents(Response.paramsData);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
    expect(component.totalCount).toEqual(Response.enrolledCourseData.enrolledCourses.length);
  });

  it('should call process facet list', () => {
    const keys = ['channel', 'gradeLevel', 'subject', 'medium'];
    const res = component.processFacetList(Response.facets, keys);
    expect(res).toEqual(Response.processedFacets);
  });

  it('should handle course redirection', () => {
    component.handleCourseRedirection({ data: Response.courseData }, null);
    expect(mockPlayerService.playContent).toHaveBeenCalled();
  });

  it('should handle course redirection along with batch id', () => {
    component.handleCourseRedirection({ data: Response.courseData }, '01353462038008627223');
    expect(mockPlayerService.playContent).toHaveBeenCalled();
  });

  it('should handle course redirection for open batch', () => {
    mockCoursesService.findEnrolledCourses = jest.fn().mockReturnValue({
      'onGoingBatchCount': 1,
      'expiredBatchCount': 0,
      'openBatch': {
        'ongoing': [],
        'expired': []
      },
      'inviteOnlyBatch': {
        'ongoing': [],
        'expired': []
      }
    }) as any;

    component.handleCourseRedirection({ data: Response.courseData }, '01353462038008627223');
    expect(mockPlayerService.playContent).toHaveBeenCalled();
  });

  it('should call process Org Data', () => {
    const res = component.processOrgData(Response.channelsList);
    expect(res).toEqual(['01269878797503692810', '0125805318613565447', '0127920475840593920']);
  });

  it('should call process enrolled courses Data', () => {
    component.processEnrolledCourses(Response.enrolledCourses, Response.pageData);
    expect(component.noResult).toBeTruthy();
    expect(component.totalCount).toEqual(1);
  });

  // it('should call handle close button', () => {
  //   component.handleCloseButton();
  //   expect(mockRouter.navigate).toHaveBeenCalled();
  // });

  // it('should call handle close button for explore page', () => {
  //   jest.spyOn(mockNavigationHelperService, 'getPreviousUrl').mockReturnValue({ url: '/explore/view-all' });
  //   component.handleCloseButton();
  //   expect(mockRouter.navigate).toHaveBeenCalled();
  // });

});
