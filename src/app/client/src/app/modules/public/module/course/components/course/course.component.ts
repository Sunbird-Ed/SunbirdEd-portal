import { combineLatest as observableCombineLatest ,  Subject } from 'rxjs';
import { PageApiService, PlayerService, ISort, OrgDetailsService, FormService, UserService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage,
  ConfigService, UtilService, NavigationHelperService, ICaraouselData, BrowserCacheTtlService,
ServerResponse} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { PublicPlayerService } from './../../../../services';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
  * To call get resource data.
  */
  private pageSectionService: PageApiService;

  public orgDetailsService: OrgDetailsService;

  public formService: FormService;
  /**
  * Refrence of UserService
  */
  private userService: UserService;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  /**
  * To show / hide no result message when no result found
 */
  noResult = false;
    /**
  * To show / hide login popup on click of content
  */
  showLoginModal = false;
  /**
  * no result  message
 */
  noResultMessage: INoResultMessage;
  /**
  * frameWorkName to pass for prominent filter
 */
  frameWorkName: string;
    /**
  *baseUrl;
  */
  public baseUrl: string;
  /**
  * Contains result object returned from getPageData API.
  */
  caraouselData: Array<ICaraouselData> = [];
  public config: ConfigService;
  public filterType: string;
  public filters: any;
  public queryParams: any;
  private router: Router;
  public redirectUrl: string;
  sortingOptions: Array<ISort>;
  contents: any;
  hashTagId: string;
  slug = '';
  isSearchable = false;
  public unsubscribe$ = new Subject<void>();
  telemetryImpression: IImpressionEventInput;
  inviewLogs = [];
  sortIntractEdata: IInteractEventEdata;
  prominentFilters: object;
  /**
   * The "constructor"
   *
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {ToasterService} iziToast Reference of toasterService.
   */
  constructor(pageSectionService: PageApiService, toasterService: ToasterService, private playerService: PlayerService,
    resourceService: ResourceService, config: ConfigService, private activatedRoute: ActivatedRoute, router: Router,
    public utilService: UtilService, public navigationHelperService: NavigationHelperService,
    orgDetailsService: OrgDetailsService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService,  formService: FormService,
    userService: UserService,  private publicPlayerService: PublicPlayerService, ) {
    this.pageSectionService = pageSectionService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.orgDetailsService = orgDetailsService;
    this.config = config;
    this.router = router;
    this.router.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.formService = formService;
    this.userService = userService;
  }

  populatePageData() {
    this.showLoader = true;
    this.noResult = false;
    const filters = _.pickBy(this.filters, value => value.length > 0);
    const option = {
      source: 'web',
      name: 'AnonymousCourse',
      filters: filters,
      params : this.config.appConfig.ExplorePage.contentApiQueryParams
    };
    this.pageSectionService.getPageData(option).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(
        (apiResponse) => {
          if (apiResponse && apiResponse.sections) {
            let noResultCounter = 0;
            this.showLoader = false;
            this.caraouselData = apiResponse.sections;
            _.forEach(this.caraouselData, (value, index) => {
              if (this.caraouselData[index].contents && this.caraouselData[index].contents.length > 0) {
                const constantData = this.config.appConfig.CoursePage.constantData;
                const metaData = this.config.appConfig.CoursePage.metaData;
                const dynamicFields = this.config.appConfig.CoursePage.dynamicFields;
                this.caraouselData[index].contents = this.utilService.getDataForCard(this.caraouselData[index].contents,
                  constantData, dynamicFields, metaData);
              }
            });
            if (this.caraouselData.length > 0) {
              _.forIn(this.caraouselData, (value, key) => {
                if (this.caraouselData[key].contents === null) {
                  noResultCounter++;
                } else if (this.caraouselData[key].contents === undefined) {
                  noResultCounter++;
                }
              });
            }
            if (noResultCounter === this.caraouselData.length) {
              this.noResult = true;
              this.noResultMessage = {
                'message': this.resourceService.messages.stmsg.m0007,
                'messageText': this.resourceService.messages.stmsg.m0006
              };
            }
          }
        },
        err => {
          this.noResult = true;
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0007,
            'messageText': this.resourceService.messages.stmsg.m0006
          };
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0004);
        }
      );
  }

  ngOnInit() {
    this.prominentFilters = {};
    this.slug = this.activatedRoute.snapshot.params.slug;
    this.filterType = this.config.appConfig.exploreCourse.filterType;
    this.redirectUrl = this.config.appConfig.exploreCourse.inPageredirectUrl;
    this.getChannelId();
    this.getframeWorkData();
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
      }
    };
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.getQueryParams();
  }
  getframeWorkData() {
    const framework = this.cacheService.get('framework' + 'search');
    if (framework) {
      this.frameWorkName = framework;
    } else {
      const formServiceInputParams = {
        formType: 'framework',
        formAction: 'search',
        contentType: 'framework-code',
      };
      this.formService.getFormConfig(formServiceInputParams, this.hashTagId).subscribe(
        (data: ServerResponse) => {
          this.frameWorkName = _.find(data, 'framework').framework;
          this.cacheService.set('framework' + 'search', this.frameWorkName ,
            {maxAge: this.browserCacheTtlService.browserCacheTtl});
        },
        (err: ServerResponse) => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      );
    }
  }
  prepareVisits(event) {
    _.forEach(event, (inview, index) => {
      if (inview.metaData.identifier) {
        this.inviewLogs.push({
          objid: inview.metaData.identifier,
          objtype: inview.metaData.contentType,
          index: index,
          section: inview.section,
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  public playContent(event) {
    if (!this.userService.loggedIn) {
      this.showLoginModal = true;
      this.baseUrl = '/' + 'learn' + '/' + 'course' + '/' + event.data.metaData.identifier;
    } else {
      this.publicPlayerService.playContent(event);
    }
  }

  compareObjects(a, b) {
    if (a !== undefined) {
      a = _.omit(a, ['language']);
    }
    if (b !== undefined) {
      b = _.omit(b, ['language']);
    }
    return _.isEqual(a, b);
  }

  getQueryParams() {
    observableCombineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return {
          params: params,
          queryParams: queryParams
        };
      }).pipe(
        takeUntil(this.unsubscribe$))
      .subscribe(bothParams => {
        this.filters = {};
        this.isSearchable = this.compareObjects(this.queryParams, bothParams.queryParams);
        this.queryParams = { ...bothParams.queryParams };
        _.forIn(this.queryParams, (value, key) => {
          if (key !== 'sort_by' && key !== 'sortType') {
            this.filters[key] = value;
          }
        });
        this.caraouselData = [];
        if (this.queryParams.sort_by && this.queryParams.sortType) {
          this.queryParams.sortType = this.queryParams.sortType.toString();
        }
        if (!this.isSearchable) {
          this.populatePageData();
        }
      });
  }

  getChannelId() {
    this.orgDetailsService.getOrgDetails(this.slug).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(
        (apiResponse: any) => {
          this.hashTagId = apiResponse.hashTagId;
        },
        err => {
          this.router.navigate(['']);
        }
      );
  }

  viewAll(event) {
    const query = JSON.parse(event.searchQuery);
    const queryParams = {};
    _.forIn(query.request.filters, (value, index) => {
      if (index === 'c_Sunbird_Dev_open_batch_count') {
        queryParams[index] = JSON.stringify(value);
      } else {
        queryParams[index] = value;
      }
    });
    queryParams['defaultSortBy'] = JSON.stringify(query.request.sort_by);
    this.cacheService.set('viewAllQuery', queryParams, {
      maxAge: this.browserCacheTtlService.browserCacheTtl
    });
    _.forIn(this.filters, (value, index) => {
      queryParams[index] = value;
    });
     const url = this.router.url.split('?');
      const sectionUrl = url[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], {queryParams: queryParams});
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  closeModal() {
    this.showLoginModal = false;
  }
}
