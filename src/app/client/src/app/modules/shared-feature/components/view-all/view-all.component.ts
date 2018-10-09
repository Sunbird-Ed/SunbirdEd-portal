import { PublicPlayerService } from '@sunbird/public';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import {
  ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, ICard
} from '@sunbird/shared';
import { SearchService, CoursesService, ISort, PlayerService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { takeUntil, first, mergeMap, map, tap, filter } from 'rxjs/operators';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent implements OnInit, OnDestroy {
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
  private router: Router;
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

  /**
   * contains the search filter type
   */
  public filterType: string;
  public sortingOptions: Array<ISort>;
  public closeUrl: string;
  public sectionName: string;
  public unsubscribe = new Subject<void>();
  constructor(searchService: SearchService, router: Router, private playerService: PlayerService,
    activatedRoute: ActivatedRoute, paginationService: PaginationService, private _cacheService: CacheService,
    resourceService: ResourceService, toasterService: ToasterService, private publicPlayerService: PublicPlayerService,
    configService: ConfigService, coursesService: CoursesService, public utilService: UtilService) {
    this.searchService = searchService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.configService = configService;
    this.coursesService = coursesService;
    this.router.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }

  ngOnInit() {
    this.filterType = _.get(this.activatedRoute.snapshot, 'data.filterType');
    this.pageLimit = this.configService.appConfig.ViewAll.PAGE_LIMIT;
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      map(results => ({ params: results[0], queryParams: results[1] })),
      filter( res => this.pageNumber !== Number(res.params.pageNumber) || !_.isEqual(this.queryParams , res.queryParams)),
      tap(res => {
        this.queryParams = res.queryParams;
        const route = this.router.url.split('/view-all');
        this.closeUrl = '/' + route[0].toString();
        this.sectionName = res.params.section.replace(/\-/g, ' ');
        this.pageNumber = Number(res.params.pageNumber);
      }),
      mergeMap((data) => {
        this.manipulateQueryParam(data.queryParams);
        this.setTelemetryImpressionData();
        this.setInteractEventData();
        return this.getContentList(data);
      }),
      takeUntil(this.unsubscribe)
    ).subscribe((response: any) => {
      this.showLoader = false;
      if (response.contentData.result.count && response.contentData.result.content) {
        this.noResult = false;
        this.totalCount = response.contentData.result.count;
        this.pager = this.paginationService.getPager(response.contentData.result.count, this.pageNumber, this.pageLimit);
        this.searchList = this.formatSearchresults(response);
      } else {
        this.noResult = true;
        this.noResultMessage = {
          'message': this.resourceService.messages.stmsg.m0007,
          'messageText': this.resourceService.messages.stmsg.m0006
        };
      }
    }, (error) => {
      this.showLoader = false;
      this.noResult = true;
      this.noResultMessage = {
        'messageText': this.resourceService.messages.fmsg.m0077
      };
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
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
        subtype: _.get(this.activatedRoute.snapshot, 'data.telemetry.subtype')
      }
    };
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
    if (!_.isEmpty(results)) {
      _.forOwn(results, (queryValue, queryKey) => {
        this.filters[queryKey] = queryValue;
      });
      this.filters = _.omit(results, ['key', 'sort_by', 'sortType', 'defaultSortBy', 'exists']);
    }
  }

  private getContentList(request) {
    const requestParams = {
      filters: _.pickBy(this.filters, value => value.length > 0),
      limit: this.pageLimit,
      pageNumber: Number(request.params.pageNumber),
      exists: request.queryParams.exists,
      sort_by: request.queryParams.sortType ?
        { [request.queryParams.sort_by]: request.queryParams.sortType } : JSON.parse(request.queryParams.defaultSortBy),
        softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints')
    };
    if (_.get(this.activatedRoute.snapshot, 'data.baseUrl') === 'learn') {
      return combineLatest(
        this.searchService.contentSearch(requestParams),
        this.coursesService.enrolledCourseData$).pipe(map(data => ({contentData: data[0] , enrolledCourseData: data[1] })));
    } else {
      return this.searchService.contentSearch(requestParams).pipe(map(data => ({contentData: data })));
    }
  }

  private formatSearchresults(response) {
    const enrolledCoursesId = [];
    _.forEach(_.get(response, 'enrolledCourseData.enrolledCourses'), (value, index) => {
      enrolledCoursesId[index] = _.get(response.enrolledCourseData.enrolledCourses[index], 'courseId');
    });
    _.forEach(response.contentData.result.content, (value, index) => {
      if (_.get(response, 'enrolledCourseData.enrolledCourses') && _.get(response, 'enrolledCourseData.enrolledCourses.length') > 0) {
        if (_.indexOf(enrolledCoursesId, response.contentData.result.content[index].identifier) !== -1) {
          const constantData = this.configService.appConfig.ViewAll.enrolledCourses.constantData;
          const metaData = { metaData: this.configService.appConfig.ViewAll.enrolledCourses.metaData };
          const dynamicFields = {};
          const enrolledCourses = _.find(response.enrolledCourseData.enrolledCourses,
            ['courseId', response.contentData.result.content[index].identifier]);
          response.contentData.result.content[index] = this.utilService.processContent(enrolledCourses,
            constantData, dynamicFields, metaData);
        } else {
          const constantData = this.configService.appConfig.ViewAll.otherCourses.constantData;
          const metaData = this.configService.appConfig.ViewAll.metaData;
          const dynamicFields = this.configService.appConfig.ViewAll.dynamicFields;
          response.contentData.result.content[index] = this.utilService.processContent(response.contentData.result.content[index],
            constantData, dynamicFields, metaData);
        }
      } else {
        const constantData = this.configService.appConfig.ViewAll.otherCourses.constantData;
        const metaData = this.configService.appConfig.ViewAll.metaData;
        const dynamicFields = this.configService.appConfig.ViewAll.dynamicFields;
        response.contentData.result.content[index] = this.utilService.processContent(response.contentData.result.content[index],
          constantData, dynamicFields, metaData);
      }
    });
    return response.contentData.result.content;
  }

  navigateToPage(page: number): undefined | void {
    const route = this.router.url.split('?');
    const url = route[0].substring(0, route[0].lastIndexOf('/'));
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
      this.router.navigate([url, page], {
        queryParams: this.queryParams,
        relativeTo: this.activatedRoute
      });
  }

  playContent(event) {
    const url = this.router.url.split('/');
    if (url[1] === 'learn' || url[1] === 'resources') {
      if (event.data.metaData.batchId) {
        event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
        event.data.metaData.contentType = 'Course';
      }
      this.playerService.playContent(event.data.metaData);
    } else {
      this.publicPlayerService.playContent(event);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
