import { PublicPlayerService } from '@sunbird/public';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, ICard, BrowserCacheTtlService, NavigationHelperService, IPagination,
  LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { SearchService, CoursesService, ISort, PlayerService, OrgDetailsService, UserService, FormService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, first, mergeMap, map, tap, filter } from 'rxjs/operators';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';


@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html'
})
export class ViewAllComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * telemetryImpression
  */
  public telemetryImpression: IImpressionEventInput;
  public closeIntractEdata: IInteractEventEdata;
  public cardIntractEdata: IInteractEventEdata;
  public sortIntractEdata: IInteractEventEdata;
  /**
   * To call searchService which helps to use list of courses
   */
  private searchService: SearchService;
  /**
  * To call resource service which helps to use language constant
  */
  private resourceService: ResourceService;
  /**
   * To get url, app configs
   */
  public configService: ConfigService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
   * Contains list of published course(s) of logged-in user
   */
  searchList: Array<ICard> = [];
  /**
   * To navigate to other pages
   */
  public router: Router;
  /**
  * To send activatedRoute.snapshot to router navigation
  * service for redirection to parent component
  */
  private activatedRoute: ActivatedRoute;
  /**
   * For showing pagination on inbox list
   */
  private paginationService: PaginationService;
  /**
  * To get enrolled courses details.
  */
  coursesService: CoursesService;
  /**
  * Refrence of UserService
  */
  private userService: UserService;
  /**
    * To show / hide no result message when no result found
   */
  noResult = false;
  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;
  /**
    * totalCount of the list
  */
  totalCount: Number;
  /**
   * Current page number of inbox list
   */
  pageNumber: number;
  /**
   * Contains page limit of outbox list
   */
  pageLimit: number;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  /**
  *baseUrl;
  */
  public baseUrl: string;
  /**
     * loader message
    */
  loaderMessage: ILoaderMessage;
  /**
   * Contains returned object of the pagination service
   * which is needed to show the pagination on inbox view
   */
  pager: IPagination;
  /**
   *url value
   */
  queryParams: any;
  /**
 *search filters
 */
  filters: any;
  hashTagId: string;
  formAction: string;
  showFilter = false;
  /**
  * To show / hide login popup on click of content
  */
  showLoginModal = false;
  public showBatchInfo = false;
  public selectedCourseBatches: any;
  /**
   /**
    * contains the search filter type
    */
  public frameworkData: object;
  public filterType: string;
  public frameWorkName: string;
  public sortingOptions: Array<ISort>;
  public sectionName: string;
  public unsubscribe = new Subject<void>();
  showExportLoader = false;
  contentName: string;
  showDownloadLoader = false;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT: string;
  SECOND_PANEL_LAYOUT: string;
  public facets;
  public facetsList = ['channel', 'gradeLevel', 'subject', 'medium'];
  public selectedFilters;
  public initFilters = false;
  private _enrolledSectionNames: string[];

  constructor(searchService: SearchService, router: Router, private playerService: PlayerService, private formService: FormService,
    activatedRoute: ActivatedRoute, paginationService: PaginationService,
    resourceService: ResourceService, toasterService: ToasterService, private publicPlayerService: PublicPlayerService,
    configService: ConfigService, coursesService: CoursesService, public utilService: UtilService,
    private orgDetailsService: OrgDetailsService, userService: UserService, private browserCacheTtlService: BrowserCacheTtlService,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService) {
    this.searchService = searchService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.configService = configService;
    this.coursesService = coursesService;
    this.userService = userService;
    this.router.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this._enrolledSectionNames = [_.get(this.resourceService, 'frmelmnts.lbl.myEnrolledCollections'), _.get(this.resourceService, 'tbk.trk.frmelmnts.lbl.mytrainings'),
    _.get(this.resourceService, 'crs.trk.frmelmnts.lbl.mytrainings'), _.get(this.resourceService, 'tvc.trk.frmelmnts.lbl.mytrainings')];
  }

  ngOnInit() {
    this.initLayout();
    if (!this.userService.loggedIn) {
      this.getChannelId();
    } else {
      this.showFilter = true;
      this.userService.userData$.subscribe(userData => {
        if (userData && !userData.err) {
          this.frameworkData = _.get(userData.userProfile, 'framework');
        }
      });
    }
    this.formAction = _.get(this.activatedRoute.snapshot, 'data.formAction');
    this.filterType = _.get(this.activatedRoute.snapshot, 'data.filterType');
    this.pageLimit = this.configService.appConfig.ViewAll.PAGE_LIMIT;
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      map(results => ({ params: results[0], queryParams: results[1] })),
      filter(res => this.pageNumber !== Number(res.params.pageNumber) || !_.isEqual(this.queryParams, res.queryParams)),
      tap(res => {
        this.showLoader = true;
        this.queryParams = res.queryParams;
        this.sectionName = res.params.section.replace(/\-/g, ' ');
        this.pageNumber = Number(res.params.pageNumber);
      }),
      tap((data) => {
        this.getframeWorkData();
        this.manipulateQueryParam(data.queryParams);
        this.setInteractEventData();
      }),
      takeUntil(this.unsubscribe)
    ).subscribe((response: any) => {
      this.getContents(response);
    }, (error) => {
      this.showLoader = false;
      this.noResult = true;
      this.noResultMessage = {
        'messageText': 'messages.fmsg.m0077'
      };
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
    });

  }

  public getFilters(filters) {
    const filterData = filters && filters.filters || {};
    if (filterData.channel && this.facets) {
      const channelIds = [];
      const facetsData = _.find(this.facets, { 'name': 'channel' });
      _.forEach(filterData.channel, (value, index) => {
        const data = _.find(facetsData.values, { 'identifier': value });
        if (data) {
          channelIds.push(data.name);
        }
      });
      if (channelIds && Array.isArray(channelIds) && channelIds.length > 0) {
        filterData.channel = channelIds;
      }
    }
    this.selectedFilters = filterData;
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }

  fetchOrgData(orgList) {
    const url = this.router.url;
    if (_.get(this.activatedRoute, 'snapshot.data.facets')) {
      const channelList = this.getChannelList(_.get(orgList, 'contentData.result.facets'));
      const rootOrgIds = this.processOrgData(channelList);
      return this.orgDetailsService.searchOrgDetails({
        filters: { isTenant: true, id: rootOrgIds },
        fields: ['slug', 'identifier', 'orgName']
      });
    } else {
      return of({});
    }
  }

  processFacetList(facets, keys) {
    const facetObj = {};
    _.forEach(facets, (facet) => {
      if (_.indexOf(keys, facet.name) > -1) {
        if (facetObj[facet.name]) {
          facetObj[facet.name].push(...facet.values);
        } else {
          facetObj[facet.name] = [];
          facetObj[facet.name].push(...facet.values);
        }
      }
    });
    return facetObj;
  }

  getContents(data) {
    this.getContentList(data).subscribe((response: any) => {
      this.fetchOrgData(response).subscribe((orgDetails) => {
        if (_.get(this.activatedRoute, 'snapshot.data.facets')) {
          let facetsList: any = this.processFacetList(_.get(response, 'contentData.result.facets'), this.facetsList);
          facetsList.channel = _.get(orgDetails, 'content');
          facetsList = this.utilService.removeDuplicate(facetsList);
          this.facets = this.updateFacetsData(facetsList);
          this.initFilters = true;
        }
        this.showLoader = false;
        if (this._enrolledSectionNames.some(sectionName => sectionName === this.sectionName)) {
          this.processEnrolledCourses(_.get(response, 'enrolledCourseData'), _.get(response, 'currentPageData'));
        } else {
          if (response.contentData.result.count && response.contentData.result.content) {
            this.noResult = false;
            this.totalCount = response.contentData.result.count;
            this.pager = this.paginationService.getPager(response.contentData.result.count, this.pageNumber, this.pageLimit);
            this.searchList = this.formatSearchresults(response.contentData.result.content);
          } else {
            this.noResult = true;
            this.noResultMessage = {
              'message': 'messages.stmsg.m0007',
              'messageText': 'messages.stmsg.m0006'
            };
          }
        }
      }, err => {
        this.showLoader = false;
        this.noResult = true;
        this.noResultMessage = {
          'messageText': 'messages.fmsg.m0077'
        };
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
    }, (error) => {
      this.showLoader = false;
      this.noResult = true;
      this.noResultMessage = {
        'messageText': 'messages.fmsg.m0077'
      };
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
    });
  }
  setInteractEventData() {
    this.closeIntractEdata = {
      id: 'close',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
    };
    this.cardIntractEdata = {
      id: 'content-card',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
    };
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
    };
  }
  private manipulateQueryParam(results) {
    this.filters = {};
    const queryFilters = _.omit(results, ['key', 'softConstraintsFilter', 'appliedFilters',
      'sort_by', 'sortType', 'defaultSortBy', 'exists', 'dynamic', 'selectedTab']);
    if (!_.isEmpty(queryFilters)) {
      _.forOwn(queryFilters, (queryValue, queryKey) => {
        this.filters[queryKey] = queryValue;
      });
    }
    if (results && results.dynamic) {
      const fields = JSON.parse(results.dynamic);
      _.forIn(fields, (value, key) => {
        this.filters[key] = value;
      });
    }
  }

  private getContentList(request) {
    const softConstraintData = {
      filters: _.get(request.queryParams, 'softConstraintsFilter') ? JSON.parse(request.queryParams.softConstraintsFilter) : {},
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };
    let manipulatedData = {};
    if (_.get(this.activatedRoute.snapshot, 'data.applyMode')) {
      manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
        softConstraintData, this.frameworkData);
    }
    const requestParams = {
      filters: _.get(this.queryParams, 'appliedFilters') ? this.filters : { ..._.get(manipulatedData, 'filters'), ...this.filters },
      limit: this.pageLimit,
      fields: this.configService.urlConFig.params.CourseSearchField,
      pageNumber: Number(request.params.pageNumber),
      mode: _.get(manipulatedData, 'mode'),
      params: this.configService.appConfig.ViewAll.contentApiQueryParams,
    };
    requestParams['exists'] = request.queryParams.exists,
      requestParams['sort_by'] = request.queryParams.sortType ?
        { [request.queryParams.sort_by]: request.queryParams.sortType } : JSON.parse(request.queryParams.defaultSortBy);
    if (_.get(manipulatedData, 'filters')) {
      requestParams['softConstraints'] = _.get(manipulatedData, 'softConstraints');
    }
    if (_.get(this.activatedRoute, 'snapshot.data.facets')) {
      requestParams['facets'] = this.facetsList;
    }

    return combineLatest(
      this.searchService.contentSearch(requestParams),
      this.coursesService.enrolledCourseData$,
      this.getCurrentPageData()).pipe(map(data => ({ contentData: data[0], enrolledCourseData: data[1], currentPageData: data[2] })));
  }

  private formatSearchresults(sectionData) {
    _.forEach(sectionData, (value, index) => {
      const constantData = this.configService.appConfig.ViewAll.otherCourses.constantData;
      const metaData = this.configService.appConfig.ViewAll.metaData;
      const dynamicFields = this.configService.appConfig.ViewAll.dynamicFields;
      sectionData[index] = this.utilService.processContent(sectionData[index],
        constantData, dynamicFields, metaData);
    });
    return sectionData;
  }

  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    const url = decodeURI(this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString()));
    this.router.navigate([url], { queryParams: this.queryParams, relativeTo: this.activatedRoute });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  playContent(event) {

    if (!this.userService.loggedIn && event.data.contentType === 'Course') {
      this.publicPlayerService.playContent(event);
    } else {
      const url = this.router.url.split('/');
      if (url[1] === 'learn' || url[1] === 'resources') {
        this.handleCourseRedirection(event);
      } else {
        this.publicPlayerService.playContent(event);
      }
    }
  }
  handleCourseRedirection({ data }) {
    const { metaData } = data;
    const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } = this.coursesService.findEnrolledCourses(metaData.identifier);

    if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
      return this.playerService.playContent(metaData);
    }

    if (onGoingBatchCount === 1) { // play course if only one open batch is present
      metaData.batchId = openBatch.ongoing.length ? openBatch.ongoing[0].batchId : inviteOnlyBatch.ongoing[0].batchId;
      return this.playerService.playContent(metaData);
    } else if (onGoingBatchCount === 0 && expiredBatchCount === 1) {
      metaData.batchId = openBatch.expired.length ? openBatch.expired[0].batchId : inviteOnlyBatch.expired[0].batchId;
      return this.playerService.playContent(metaData);
    }
    this.selectedCourseBatches = { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch, courseId: metaData.identifier };
    this.showBatchInfo = true;
  }
  getChannelId() {
    this.orgDetailsService.getOrgDetails()
      .subscribe(
        (apiResponse: any) => {
          this.hashTagId = apiResponse.hashTagId;
          this.showFilter = true;
        },
        err => {

        }
      );
  }
  private getframeWorkData() {
    const formServiceInputParams = {
      formType: 'framework',
      formAction: 'search',
      contentType: 'framework-code',
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe(
      (data: ServerResponse) => {
        this.frameWorkName = _.find(data, 'framework').framework;
      },
      (err: ServerResponse) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryImpressionData();
    });
  }
  setTelemetryImpressionData() {
    this.telemetryImpression = {
      context: {
        env: _.get(this.activatedRoute.snapshot, 'data.telemetry.env')
      },
      edata: {
        type: _.get(this.activatedRoute.snapshot, 'data.telemetry.type'),
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
        uri: this.router.url,
        subtype: _.get(this.activatedRoute.snapshot, 'data.telemetry.subtype'),
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  closeModal() {
    this.showLoginModal = false;
  }

  updateCardData(downloadListdata) {
    _.each(this.searchList, (contents) => {
      this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
  }
  redoLayout() {
    if (this.layoutConfiguration) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
    }
  }

  processOrgData(channels) {
    const channelList = [];
    _.forEach(channels.values, (channel) => {
      if (channel.name) {
        channelList.push(channel.name);
      }
    });
    return channelList;
  }

  getChannelList(channels) {
    return _.find(channels, { 'name': 'channel' });
  }

  /**
   * @since - release-3.2.0-SH-652
   * @param  {} courseData
   * @description - It will process the enrolled course data if user comes to this page from My courses section
   */
  processEnrolledCourses(courseData, pageData) {
    const enrolledCourses = _.get(courseData, 'enrolledCourses');
    if (enrolledCourses) {
      const { contentType: pageContentType = null, search: { filters: { primaryCategory: pagePrimaryCategories = [] } } } = pageData;
      const enrolledContentPredicate = course => {
        const { primaryCategory = null, contentType = null } = _.get(course, 'content') || {};
        return pagePrimaryCategories.some(category => _.toLower(category) === _.toLower(primaryCategory)) || (_.toLower(contentType) === _.toLower(pageContentType));
      };
      const filteredCourses = _.filter(enrolledCourses || [], enrolledContentPredicate);
      const enrolledCourseCount = _.get(filteredCourses, 'length');
      this.noResult = false;
      this.totalCount = enrolledCourseCount;
      const sortedData = _.map(_.orderBy(filteredCourses, ['enrolledDate'], ['desc']), (val) => {
        const value = _.get(val, 'content');
        return value;
      });
      this.searchList = this.formatSearchresults(sortedData);
    } else {
      this.noResult = true;
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'messageText': 'messages.stmsg.m0006'
      };
    }
  }

  updateFacetsData(facets) {
    const facetsData = [];
    _.forEach(facets, (facet, key) => {
      switch (key) {
        case 'board':
          const boardData = {
            index: '1',
            label: _.get(this.resourceService, 'frmelmnts.lbl.boards'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectBoard'),
            values: facet,
            name: key
          };
          facetsData.push(boardData);
          break;
        case 'medium':
          const mediumData = {
            index: '2',
            label: _.get(this.resourceService, 'frmelmnts.lbl.medium'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectMedium'),
            values: facet,
            name: key
          };
          facetsData.push(mediumData);
          break;
        case 'gradeLevel':
          const gradeLevelData = {
            index: '3',
            label: _.get(this.resourceService, 'frmelmnts.lbl.class'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectClass'),
            values: facet,
            name: key
          };
          facetsData.push(gradeLevelData);
          break;
        case 'subject':
          const subjectData = {
            index: '4',
            label: _.get(this.resourceService, 'frmelmnts.lbl.subject'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectSubject'),
            values: facet,
            name: key
          };
          facetsData.push(subjectData);
          break;
        case 'publisher':
          const publisherData = {
            index: '5',
            label: _.get(this.resourceService, 'frmelmnts.lbl.publisher'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectPublisher'),
            values: facet,
            name: key
          };
          facetsData.push(publisherData);
          break;
        case 'contentType':
          const contentTypeData = {
            index: '6',
            label: _.get(this.resourceService, 'frmelmnts.lbl.contentType'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectContentType'),
            values: facet,
            name: key
          };
          facetsData.push(contentTypeData);
          break;
        case 'channel':
          const channelLists = [];
          _.forEach(facet, (channelList) => {
            if (channelList.orgName) {
              channelList.name = channelList.orgName;
            }
            channelLists.push(channelList);
          });
          const channelData = {
            index: '1',
            label: _.get(this.resourceService, 'frmelmnts.lbl.orgname'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.orgname'),
            values: channelLists,
            name: key
          };
          facetsData.push(channelData);
          break;
      }
    });
    return facetsData;
  }
  public handleCloseButton() {
    const [path] = this.router.url.split('/view-all');
    const redirectionUrl = `/${path.toString()}`;
    const { selectedTab = '' } = this.queryParams || {};
    this.router.navigate([redirectionUrl], { queryParams: { selectedTab } });
  }

  private getFormConfig(input = { formType: 'contentcategory', formAction: 'menubar', contentType: 'global' }): Observable<object> {
    return this.formService.getFormConfig(input);
  }

  private getPageData = selectedTab => formData => _.find(formData, data => data.contentType === selectedTab);

  private getCurrentPageData() {
    const { currentPageData = null } = _.get(history, 'state') || {};
    if (currentPageData) return of(currentPageData);
    const selectedTab = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook';
    return this.getFormConfig().pipe(
      map(this.getPageData(selectedTab))
    )
  }
}
