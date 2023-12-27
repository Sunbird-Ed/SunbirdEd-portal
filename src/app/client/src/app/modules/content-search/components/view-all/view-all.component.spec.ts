import { ResourceService, ConfigService, ToasterService, NavigationHelperService, PaginationService } from '../../../shared';
import { LearnerService, CoursesService, SearchService, PlayerService, FormService } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewAllComponent } from './view-all.component';
import { throwError as observableThrowError, of as observableOf, Observable, of, throwError } from 'rxjs';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { Location } from '@angular/common';
import { BrowserCacheTtlService, LayoutService, UtilService } from '../../../shared';
import { OrgDetailsService, UserService } from '../../../core';
import { Response } from './view-all.component.spec.data';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('ViewAllComponent', () => {
  let component: ViewAllComponent;

  const mockSearchService: Partial<SearchService> = {};
  const mockPlayerService: Partial<PlayerService> = {
    playContent: jest.fn()
  };
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn().mockImplementation(() => of(Response.formData))
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
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
  const mockPublicPlayerService: Partial<PublicPlayerService> = {
    updateDownloadStatus: jest.fn()
  };
  const mockRouter: Partial<Router> = {
    url: '/resources/view-all/Course-Unit/1',
    navigate: jest.fn()
  };
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    getPreviousUrl: jest.fn({ url: '/explore' } as any),
    goBack: jest.fn(),
    popHistory: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      emsg:{
        m0005:'Something went wrong, try again later'
      },
      lbl: {
        boards: 'Board',
        selectBoard: 'Select Board',
        medium: 'Medium',
        selectMedium: 'Select Medium',
        class: 'Classes',
        selectClass: 'Select Classes',
        subject: 'Subjects',
        selectSubject: 'Select Subjects',
        publisher: 'Publisher',
        selectPublisher: 'Select publisher',
        contentType: 'Content type',
        selectContentType: 'Select content type',
        orgname: 'Organization Name',

      }
    }
  };
  const mockUtilService: Partial<UtilService> = {
    processContent: jest.fn()
  };
  const mockOrgDetailsService: Partial<OrgDetailsService> = {
    searchOrgDetails: jest.fn(() => of(Response.orgDetails)),
    getOrgDetails:jest.fn()
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue('tn') as any,
    userData$: of({userProfile: {
      userId: 'sample-uid',
      rootOrgId: 'sample-root-id',
      rootOrg: {},
      hashTagIds: ['id']
    } as any}) as any,
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
    isLayoutAvailable: jest.fn(() => true),
    redoLayoutCSS: jest.fn(),
    switchableLayout: jest.fn()
  };
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn(),
    transformDataForCC: jest.fn(),
    getGlobalFilterCategoriesObject: jest.fn(() =>[
      { index: 1,label: 'Organization Name', placeHolder: 'Organization Name',code:'channel', name: 'channel'},
      { index: 1,label: 'Board',placeHolder: 'Select Board', code: 'board', name: 'Board' },
      { index: 2 ,label: 'Medium',placeHolder: 'Select Medium', code: 'medium', name: 'Medium' },
      { index: 3,label: 'Classes', placeHolder: 'Select Classes',code:'gradeLevel', name: 'gradeLevel'},
      { index: 4,label: 'Subjects', placeHolder: 'Select Subjects',code:'subject', name: 'subject'},
      { index: 5,label: 'Publisher', placeHolder: 'Select publisher',code:'publisher', name: 'publisher'},
      { index: 6,label: 'Content type', placeHolder: 'Select content type',code:'contentType', name: 'contentType'},
    ] ),
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
      mockCslFrameworkService as CslFrameworkService
    );

  });

  beforeEach(() => {
    jest.clearAllMocks();
    component.globalFilterCategoriesObject = component.cslFrameworkService.getGlobalFilterCategoriesObject();
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
          '01299870666187571229'
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
  it('should call fetchOrgData method', () => {
    mockActivatedRoute.snapshot = { data: { facets: Response.facets } } as any
    jest.spyOn(component, 'processOrgData');
    component.fetchOrgData(Response.orgList);
    expect(component.processOrgData).toBeCalled();
  });
  it('should call handle close button for explore page', () => {
    component.queryParams = {
      selectedTab: 'all',
      contentType: ['Course'], objectType: ['Content'], status: ['Live'],
      defaultSortBy: JSON.stringify({ lastPublishedOn: 'desc' })
    } as any;
    jest.spyOn(mockNavigationHelperService, 'getPreviousUrl').mockReturnValue({ url: '/explore/view-all' });
    component.handleCloseButton();
    expect(mockNavigationHelperService.goBack).toHaveBeenCalled();
    component.queryParams = {} as any;
  });
  it('should call handle close button', () => {
    component.queryParams = {
      selectedTab: 'other',
      contentType: ['Course'], objectType: ['Content'], status: ['Live'],
      defaultSortBy: JSON.stringify({ lastPublishedOn: 'desc' })
    } as any;
    component.handleCloseButton();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
  it('should call updateFacetsData method for board', () => {
    const obj = [
      {
        index: '1',
        label: 'Board',
        placeholder: 'Select Board',
        values: {
          index: '1',
          label: 'Organization Name',
          placeholder: 'Organization Name',
          name: 'channel'
        },
        name: 'board'
      }
    ]
    const returnValue = component.updateFacetsData(Response.facetBoard);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(obj));
  });
  it('should call updateFacetsData method for medium', () => {
    const obj = [
      {
        index: '2',
        label: 'Medium',
        placeholder: 'Select Medium',
        values: {
          index: '1',
          label: 'Medium',
          placeholder: 'Medium',
          name: 'medium'
        },
        name: 'medium'
      }
    ]
    const returnValue = component.updateFacetsData(Response.facetMedium);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(obj));
  });
  it('should call updateFacetsData method for gradeLevel', () => {
    const obj = [
      {
        index: '3',
        label: 'Classes',
        placeholder: 'Select Classes',
        values: { index: '1', label: 'Class', placeholder: 'Class', name: 'Class' },
        name: 'gradeLevel'
      }
    ]
    const returnValue = component.updateFacetsData(Response.facetgradeLevel);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(obj));
  });
  it('should call updateFacetsData method for Subject', () => {
    const obj = [
      {
        index: '4',
        label: 'Subjects',
        placeholder: 'Select Subjects',
        values: {
          index: '1',
          label: 'Subject',
          placeholder: 'Subject',
          name: 'subject'
        },
        name: 'subject'
      }
    ]
    const returnValue = component.updateFacetsData(Response.facetSubject);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(obj));
  });
  it('should call updateFacetsData method for Publisher', () => {
    const obj = [
      {
        index: '5',
        label: 'Publisher',
        placeholder: 'Select publisher',
        values: {
          index: '1',
          label: 'Publisher',
          placeholder: 'Organization Name',
          name: 'publisher'
        },
        name: 'publisher'
      }
    ]
    const returnValue = component.updateFacetsData(Response.facetPublisher);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(obj));
  });
  it('should call updateFacetsData method ContentType', () => {
    const obj = [
      {
        index: '6',
        label: 'Content type',
        placeholder: 'Select content type',
        values: {
          index: '1',
          label: 'contentType',
          placeholder: 'contentType',
          name: 'contentType'
        },
        name: 'contentType'
      }
    ]
    const returnValue = component.updateFacetsData(Response.facetContentType);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(obj));
  });

  it('should call updateFacetsData method channel', () => {
    const mockGlobalFilterCategoriesObject = [
    { index: 1, label: 'Organization Name', placeHolder: 'Organization Name', code: 'channel', name: 'channel' },
    ];
    const mockFacets = {
       channel: ['Chattisgarh']
    };
    jest.spyOn(component.cslFrameworkService, 'getGlobalFilterCategoriesObject')
    .mockReturnValue(mockGlobalFilterCategoriesObject);
    const returnValue = component.updateFacetsData(mockFacets);
    expect(returnValue).toEqual([{"index": "1", "label": "Organization Name", "name": "channel", "placeholder": "Organization Name", "values": ["Chattisgarh"]}]);
  });

  it('should call processEnrolledCourses method', () => {
    component.processEnrolledCourses(Response.enrolledCourseData, Response.pageData);
    expect(component.noResult).toBeFalsy();
    expect(component.totalCount).toEqual(0);
  });

  it('should call updateCardData method', () => {
    component.searchList = Response.successData as any;
    component.updateCardData(Response.enrolledCourseData);
    expect(mockPublicPlayerService.updateDownloadStatus).toBeCalled();
  });

  it('should call getframeWorkData method', () => {
    mockFormService.getFormConfig = jest.fn(() => of({
      id: 'sample-id'
    }));
    component['getframeWorkData']();
    expect(mockFormService.getFormConfig).toBeCalled();
  });

  it('should call getframeWorkData method with error', () => {
    // jest.spyOn(mockToasterService,'error');
     mockFormService.getFormConfig = jest.fn(() => throwError({
      id:'1234',
      params: {
        resmsgid: 'string',
        err: 'error',
        status: 'string',
        errmsg: 'Something went wrong, try again later'
      },
      responseCode:'401',
      result:'string',
      ts:'time',
      ver:'123'
   }) as any)as any;
    component['getframeWorkData']();
    // expect(mockToasterService.error).toBeCalled();
  });
  it('should call setTelemetryImpressionData method', () => {
    mockActivatedRoute.snapshot = { data: { telemetry:{env:'localenv'}} } as any
    mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue('12345') as any;
    const obj = {
      context: { env: 'localenv' },
      edata: {
        type: undefined,
        pageid: undefined,
        uri: '/resources/view-all/Course-Unit/1',
        subtype: undefined,
        duration: '12345'
      }
    }
    component.setTelemetryImpressionData();
    expect(JSON.stringify(component.telemetryImpression)).toEqual(JSON.stringify(obj));
  });
  it('should call getChannelId method', () => {
    jest.spyOn(mockOrgDetailsService, 'getOrgDetails').mockReturnValue(of(Response.orgDetails)as any)as any;
    component.getChannelId();
  });
  describe("ngAfterViewInit", () => {
    it('should set ngAfterViewInit', () => {
      component.ngAfterViewInit();
      setTimeout(() => {
        expect(component.setTelemetryImpressionData).toBeCalled();
      },100)
    });
  });
  describe('initLayout', () => {
    it('should call init Layout', () => {
      mockLayoutService.initlayoutConfig = jest.fn(() => { })
      mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
      component.initLayout();
      mockLayoutService.switchableLayout().subscribe(layoutConfig => {
        expect(layoutConfig).toBeDefined();
      });
    });
  });
  describe("ngOnDestroy", () => {
    it('should destroy sub', () => {
      component.unsubscribe = {
        next: jest.fn(),
        complete: jest.fn()
      } as any;
      component.ngOnDestroy();
      expect(component.unsubscribe.next).toHaveBeenCalled();
      expect(component.unsubscribe.complete).toHaveBeenCalled();
    });
  });

  xit('should initialize data on ngOnInit', () => {
    jest.spyOn(mockCslFrameworkService, 'getFrameworkCategories').mockReturnValue({});
    jest.spyOn(mockCslFrameworkService, 'getGlobalFilterCategoriesObject').mockReturnValue([]);
    jest.spyOn(mockCslFrameworkService, 'transformDataForCC').mockReturnValue([]);
    component.ngOnInit();
    expect(component.frameworkCategories).toBeDefined();
    expect(component.globalFilterCategoriesObject).toBeDefined();
    expect(component.categoryKeys).toBeDefined();
    expect(component.facetsList).toBeDefined();
  });

});
