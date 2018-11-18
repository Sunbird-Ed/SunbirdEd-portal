
import {combineLatest as observableCombineLatest,  Observable,  SubscriptionLike as ISubscription  } from 'rxjs';
import { PageApiService, PlayerService, ISort, UserService,  } from '@sunbird/core';
import { Component, OnInit , OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, INoResultMessage, ConfigService, UtilService,
  BrowserCacheTtlService} from '@sunbird/shared';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';

/**
 * This component contains 2 sub components
 * 1)PageSection: It displays carousal data.
 * 2)ContentCard: It displays resource data.
 */
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit, OnDestroy {
  /**
  * inviewLogs
  */
  inviewLogs = [];
  /**
   * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  sortIntractEdata: IInteractEventEdata;
  /**
 * To show toaster(error, success etc) after any API calls
 */
  private toasterService: ToasterService;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
   /**
   * To get user details.
   */
  private userService: UserService;
  /**
  * To call get resource data.
  */
  private pageSectionService: PageApiService;
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
   * no result  message
  */
  noResultMessage: INoResultMessage;
  userSubscription: ISubscription;
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
  framework: any;
  /**
  * Variable to show popup to install the app
  */
  showAppPopUp = false;
  viewinBrowser = false;
  dataDrivenFilters: object;
  /**
   * The "constructor"
   *
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {ToasterService} iziToast Reference of toasterService.
   */
  constructor(pageSectionService: PageApiService, toasterService: ToasterService, private playerService: PlayerService,
    resourceService: ResourceService, config: ConfigService, private activatedRoute: ActivatedRoute, router: Router,
  public utilService: UtilService, private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
  userService: UserService) {
    this.pageSectionService = pageSectionService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.router = router;
    this.router.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
    this.userService = userService;
  }
  /**
  * Subscribe to getPageData api.
  */
  populatePageData() {
    this.showLoader = true;
    this.noResult = false;
    let softConstraints = {};
    const filters = _.pickBy(this.filters, value => value.length > 0);
      if (this.viewinBrowser && _.isEmpty(this.queryParams)) {
        filters.board = this.dataDrivenFilters['board'];
        softConstraints = {board: 100 };
    }
    const option = {
      source: 'web',
      name: 'Resource',
      filters: filters,
      softConstraints : softConstraints
    };
    if (this.queryParams.sort_by) {
      option['sort_by'] = {[this.queryParams.sort_by]: this.queryParams.sortType  };
    }
    this.pageSectionService.getPageData(option).subscribe(
      (apiResponse) => {
        if (apiResponse && apiResponse.sections ) {
          let noResultCounter = 0;
          this.showLoader = false;
          this.caraouselData = apiResponse.sections;
          _.forEach(this.caraouselData, (value, index) => {
              if (this.caraouselData[index].contents && this.caraouselData[index].contents.length > 0) {
                const constantData = this.config.appConfig.Library.constantData;
                const metaData = this.config.appConfig.Library.metaData;
                const dynamicFields = this.config.appConfig.Library.dynamicFields;
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
  /**
 *This method calls the populatePageData
 */
  ngOnInit() {
    this.dataDrivenFilters = {};
    this.filterType = this.config.appConfig.library.filterType;
    this.redirectUrl = this.config.appConfig.library.inPageredirectUrl;
    this.showAppPopUp = this.utilService.showAppPopUp;
    this.getQueryParams();
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
      pageid: 'resource-page'
    };
    this.userSubscription = this.userService.userData$.subscribe(
      user => {
        if (user && !user.err) {
          this.framework = user.userProfile.framework;
        }
      }
    );
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
  /**
   *  to get query parameters
   */
  getQueryParams() {
    observableCombineLatest(
        this.activatedRoute.params,
        this.activatedRoute.queryParams,
        (params: any, queryParams: any) => {
          return {
            params: params,
            queryParams: queryParams
          };
        })
      .subscribe(bothParams => {
        this.filters = {};
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
        this.viewinBrowser = false;
        this.populatePageData();
      });
  }
  playContent(event) {
    this.playerService.playContent(event.data.metaData);
  }

  viewAll(event) {
    const query = JSON.parse(event.searchQuery);
    const queryParams = {};
    _.forIn(query.request.filters, (value, index) => {
      queryParams[index] = value;
    });
    queryParams['defaultSortBy'] = JSON.stringify(query.request.sort_by);
    queryParams['exists'] = query.request.exists;
    this.cacheService.set('viewAllQuery', queryParams, {
      maxAge: this.browserCacheTtlService.browserCacheTtl
    });
    _.forIn(this.filters, (value, index) => {
      queryParams[index] = value;
    });
      const sectionUrl = 'resources/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], {queryParams: queryParams});
  }

  viewInBrowser() {
    this.viewinBrowser = true;
    this.populatePageData();
  }

  getFilters(filters) {
    _.forEach(filters, (value) => {
      if (value.code === 'board') {
        value.range = _.orderBy(value.range, ['index'], ['asc']);
        this.dataDrivenFilters['board'] = _.get(value, 'range[0].name') ? _.get(value, 'range[0].name') : [];
      }
    });
    this.getQueryParams();
  }


  ngOnDestroy() {
    this.utilService.toggleAppPopup();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
