import { PageApiService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, INoResultMessage, ConfigService } from '@sunbird/shared';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
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
  /**
   * The "constructor"
   *
   * @param {PageApiService} pageSectionService Reference of pageSectionService.
   * @param {ToasterService} iziToast Reference of toasterService.
   */
  constructor(pageSectionService: PageApiService, toasterService: ToasterService,
    resourceService: ResourceService, config: ConfigService, private activatedRoute: ActivatedRoute, router: Router) {
    this.pageSectionService = pageSectionService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.router = router;
    this.router.onSameUrlNavigation = 'reload';
  }
  /**
  * Subscribe to getPageData api.
  */
  populatePageData() {
    const option = {
      source: 'web',
      name: 'Resource',
      filters: _.pickBy(this.filters, value => value.length > 0),
      sort_by: {}
    };
    this.pageSectionService.getPageData(option).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse) {
          this.noResultMessage = {
            'message': this.resourceService.messages.stmsg.m0007,
            'messageText': this.resourceService.messages.stmsg.m0006
          };
          let noResultCounter = 0;
          this.showLoader = false;
          this.caraouselData = apiResponse.result.response.sections;
          _.forEach(this.caraouselData, (value, index) => {
              _.forEach(this.caraouselData[index].contents, (item, key) => {
                const action = { left: { displayType: 'rating' } };
                this.caraouselData[index].contents[key].action = action;
              });
          });
          if (this.caraouselData.length > 0) {
            _.forIn(this.caraouselData, (value, key) => {
              if (this.caraouselData[key].contents === undefined) {
                noResultCounter++;
              }
            });
          }
          if (noResultCounter === this.caraouselData.length) {
            this.noResult = true;
          }
        }
      },
      err => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      }
    );
  }
  /**
 *This method calls the populatePageData
 */
  ngOnInit() {
    this.filters = {};
    this.filterType = this.config.appConfig.library.filterType;
    this.redirectUrl = this.config.appConfig.library.inPageredirectUrl;
    console.log('this.redirectUrl', this.redirectUrl);
    this.getQueryParams();
  }

  /**
   *  to get query parameters
   */
  getQueryParams() {
    Observable
      .combineLatest(
        this.activatedRoute.params,
        this.activatedRoute.queryParams,
        (params: any, queryParams: any) => {
          return {
            params: params,
            queryParams: queryParams
          };
        })
      .subscribe(bothParams => {
        this.queryParams = { ...bothParams.queryParams };
        this.filters = this.queryParams;
        this.populatePageData();
      });
  }
}
