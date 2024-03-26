import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService, PageApiService } from '@sunbird/core';
import {
  ServerResponse, ConfigService, ToasterService, IPagination,
  ResourceService, ILoaderMessage, INoResultMessage, ICaraouselData, NavigationHelperService
} from '@sunbird/shared';
import { WorkSpaceService, BatchService } from '../../services';
import * as _ from 'lodash-es';
import { SuiModalService } from '@project-sunbird/ng2-semantic-ui';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-batch-page-section',
  templateUrl: './batch-page-section.component.html'
})
export class BatchPageSectionComponent extends WorkSpace implements OnInit, OnDestroy , AfterViewInit {

 public unsubscribe$ = new Subject<void>();


  pageid: string;

  inviewLogs = [];

  /**
  * To navigate to other pages
  */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;
  public carouselData: Array<ICaraouselData> = [];

  /**
   * Contains list of batchList  of logged-in user
  */
  batchList = [];

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;

  /**
   * To show / hide no result message when no result found
  */
  noResult = false;

  /**
   * To show / hide error
  */
  showError = false;

  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;

  /**
    * to get url app config
  */
  public config: ConfigService;
  /**
    * Contains page limit of batch  list
  */
  pageLimit: number;

  /**
    * Current page category of batch list, defaults to assigned
  */
  category: string;

  /**
    * totalCount of the list
  */
  totalCount: Number;

  /**
  * Contains returned object of the pagination service
  * which is needed to show the pagination on inbox view
  */
  pager: IPagination;

  filters: object;

  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;

  /**
  * To call resource service which helps to use language constant
 */
  public resourceService: ResourceService;
  /**
	* telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
    * @param {UserService} UserService Reference of UserService
    * @param {Router} route Reference of Router
    * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(private pageApiService: PageApiService, public modalService: SuiModalService, public searchService: SearchService,
    private batchService: BatchService,
    public workSpaceService: WorkSpaceService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, public navigationhelperService: NavigationHelperService) {
    super(searchService, workSpaceService, userService);
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0108,
    };
    this.noResultMessage = {
      'message': 'messages.stmsg.m0020',
      'messageText': 'messages.stmsg.m0008'
    };
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$))
    .subscribe(params => {
      this.category = params.category;
      this.fetchPageData();
    });
    this.batchService.updateEvent
      .subscribe((data) => {
        this.fetchPageData();
    });
  }

  /**
    * This method sets the make an api call to get all batch with page No and offset
  */
  public fetchPageData() {
    this.showLoader = true;
    this.filters = {createdFor: this.userService.userProfile.organisationIds};
    if (this.category === 'created') {
      this.filters['createdBy'] = this.userService.userid;
    } else {
      this.filters['mentors'] = this.userService.userid;
    }
    const option: any = {
      source: 'web',
      name: 'User Courses',
      filters: this.filters,
      sort_by: { createdDate: this.config.appConfig.WORKSPACE.createdDate },
      params: {fields: 'participants'}
    };
    this.pageApiService.getBatchPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.prepareCarouselData(_.get(data, 'sections'));
      }, err => {
        this.showLoader = false;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }

  onCardClick (event) {
    const batchData = event.data;
    if (batchData.enrollmentType === 'open') {
      this.batchService.setBatchData(batchData);
    }
    this.route.navigate(['update/batch', batchData.identifier], {queryParamsHandling: 'merge', relativeTo: this.activatedRoute});
  }

  /**
    This method prepares batch card data with count of partipants,
    adds userName and prepares data structure to reuse exising page section component used in
    consumption pages for content cars
  */
  public prepareCarouselData(sections = []) {
    this.batchList = _.flatten(_.map(sections, 'contents'));
    if (!this.batchList || !this.batchList.length) {
      this.carouselData = [];
      this.showLoader = false;
      return;
    }
    const courseIds = _.map(this.batchList, 'courseId');
    const searchOption = {
      'filters': {
        'identifier': _.uniq(courseIds),
        'status': ['Live'],
        'contentType': ['Course']
      },
      'fields': ['name']
    };

    // Get course details for the batches to show content name on batch card
    this.searchService.contentSearch(searchOption, false)
      .subscribe(data => {
        if (_.get(data, 'result.content')) {
          _.map(this.batchList, (batchData) => {
            batchData.courseDetails = _.find(_.get(data, 'result.content'), courseData => courseData.identifier === batchData.courseId);
          });
        }
      });

    const userList = _.compact(_.uniq(_.map(this.batchList, 'createdBy')));
    const { slickSize } = this.config.appConfig.CourseBatchPageSection;
    const req = {
      filters: { identifier: userList }
    };
    this.UserList(req).pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: ServerResponse) => {
      if (res.result.response.count && res.result.response.content.length > 0) {
        const userNamesKeyById = _.keyBy(res.result.response.content, 'identifier');
        _.forEach(sections, (section, sectionIndex) => {
          _.forEach(section.contents, (content, contentIndex) => {
            sections[sectionIndex].contents[contentIndex]['userName'] = (userNamesKeyById[content.createdBy].firstName || '')
            + ' ' + (userNamesKeyById[content.createdBy].lastName || '');
            sections[sectionIndex].contents[contentIndex]['metaData'] = {identifier: content.identifier};
            sections[sectionIndex].contents[contentIndex]['label'] = content.participantCount || 0;
          });
        });
        this.carouselData = sections;
        this.showLoader = false;
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    },
      (err: ServerResponse) => {
        this.showLoader = false;
        this.noResult = false;
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );
  }

  public prepareVisits(event) {
    _.forEach(event, (inView, index) => {
      if (inView.metaData.identifier) {
        this.inviewLogs.push({
          objid: inView.metaData.identifier,
          objtype: 'batch',
          index: index,
          section: inView.section,
        });
      }
    });
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inviewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }

  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    const searchQueryParams: any = {};
    _.forIn(searchQuery.request.filters, (value, key) => {
      if (_.isPlainObject(value)) {
        searchQueryParams.dynamic = JSON.stringify({[key]: value});
      } else {
        searchQueryParams[key] = value;
      }
    });
    searchQueryParams.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQueryParams.exists = searchQuery.request.exists;
    const queryParams = { ...searchQueryParams, ...this.filters };
    const sectionUrl = '/workspace/batches/view-all/' + event.name.replace(/\s/g, '-');
    this.route.navigate([sectionUrl, 1], {queryParams: queryParams});
  }

  public setTelemetryImpression () {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.category,
        visits: this.inviewLogs,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.setTelemetryImpression();
    });
  }

  ngOnDestroy() {
   this.unsubscribe$.next();
   this.unsubscribe$.complete();
  }
}

