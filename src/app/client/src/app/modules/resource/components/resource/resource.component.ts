
import {combineLatest as observableCombineLatest,  Observable } from 'rxjs';
import { PageApiService, PlayerService, ISort } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, INoResultMessage, ConfigService, UtilService} from '@sunbird/shared';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';

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
export class ResourceComponent implements OnInit {
  /**
  * inviewLogs
  */
  inviewLogs = [];
  /**
   * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  filterIntractEdata: IInteractEventEdata;
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
  /**
   * The "constructor"
   *
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {ToasterService} iziToast Reference of toasterService.
   */
  constructor(pageSectionService: PageApiService, toasterService: ToasterService, private playerService: PlayerService,
    resourceService: ResourceService, config: ConfigService, private activatedRoute: ActivatedRoute, router: Router,
  public utilService: UtilService) {
    this.pageSectionService = pageSectionService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.router = router;
    this.router.onSameUrlNavigation = 'reload';
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  /**
  * Subscribe to getPageData api.
  */
  populatePageData() {
    this.showLoader = true;
    this.noResult = false;
    const option = {
      source: 'web',
      name: 'Resource',
      filters: _.pickBy(this.filters, value => value.length > 0),
      sort_by: {[this.queryParams.sort_by]: this.queryParams.sortType  }
    };
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
    this.filterType = this.config.appConfig.library.filterType;
    this.redirectUrl = this.config.appConfig.library.inPageredirectUrl;
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
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: 'resource-page'
    };
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: 'resource-page'
    };
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
        this.populatePageData();
      });
  }
  playContent(event) {
    this.playerService.playContent(event.data.metaData);
  }
}
