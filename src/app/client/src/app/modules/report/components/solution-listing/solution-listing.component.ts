import { ConfigService, ResourceService, LayoutService, PaginationService, IPagination,
  ILoaderMessage, INoResultMessage } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import 'datatables.net';
import { ObservationUtilService } from '../../../observation/service';
import { ObservationService, UserService, TncService } from '@sunbird/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-solution-listing',
  templateUrl: './solution-listing.component.html',
  styleUrls: ['./solution-listing.component.scss'],
})
export class SolutionListingComponent implements OnInit {
  public noResultFoundError: string;
  layoutConfiguration: any;
  config;
  payload;
  entityType = '';
  pageSize = 10;
  pageNo = 1;
  solutionList = [];
  showLoadMore = true;
  filters = [];
  selectedEntity: any;
  dtOptions: any = {};
  showModal = false;
  solution: any;
  public paginationDetails: IPagination;
  public loaderMessage: ILoaderMessage;
  public noResultMessage: INoResultMessage;
  showLoader = true;
  noResult = false;
  reportViewerTncVersion: string;
  reportViewerTncUrl: string;
  showTncPopup = false;
  public userProfile;
  constructor(
    public resourceService: ResourceService,
    private layoutService: LayoutService,
    private observationService: ObservationService,
    config: ConfigService,
    public observationUtilService: ObservationUtilService,
    public userService: UserService,
    private router: Router,
    public paginationService: PaginationService,
    public configService: ConfigService,
    public tncService: TncService
  ) {
    this.config = config;
    this.paginationDetails = this.paginationService.getPager(0, 1, this.pageSize);
    this.noResultMessage = {
      'messageText':  'messages.stmsg.m0131'
    };
  }

  ngOnInit() {
    this.dtOptions = {
      autoWidth: true,
      searching: false,
      pageLength:this.pageSize,
      info: false,
      dom: '<"pull-right">rt'
    };
    this.selectedEntity = 'selected';
    this.userService.userData$.pipe(first()).subscribe(async (user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
      }
    });
    this.initLayout();
    this.getProfileData();
  }

  getProfileData() {
    this.observationUtilService.getProfileDataList().then(
      (data) => {
        this.payload = data;
        this.getSolutions();
      },
      (error) => {}
    );
  }

  getSolutions() {
    this.solutionList = [];
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.OBSERVATION
          .OBSERVATION_REPORT_SOLUTION_LIST +
        `limit=${this.pageSize}&page=${this.pageNo}&entityType=${this.entityType}`,
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(
      (data) => {
        if (data.result) {
          this.showLoader = false;
        } else {
          this.showLoader = false;
          this.noResult = true;
        }
        this.solutionList =
          data && data.result ? this.solutionList.concat(data.result.data) : [];
        this.filters = data && data.result && !this.filters.length ? data.result.entityType : this.filters;
        this.paginationDetails.currentPage = this.pageNo;
        this.paginationDetails = this.paginationService.getPager(
          data.result.count,
          this.paginationDetails.currentPage,
          this.pageSize
        );
        this.showLoadMore =
          this.solutionList.length < data.result.count ? true : false;
          if(this.solutionList.length>0){
            this.showLoader=false;
          }
          else{
            this.showLoader=false;
            this.noResult=true;
          }
      },
      (error) => {
        this.showLoader = false;
          this.noResult = true;
      }
    );
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    this.pageNo = page;
    this.getSolutions();
  }

  getDataByEntity(e) {
    this.selectedEntity = e.target.value;
    this.entityType = this.selectedEntity;
    this.pageNo = 1;
    this.solutionList = [];
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.OBSERVATION
          .OBSERVATION_REPORT_SOLUTION_LIST +
        `limit=${this.pageSize}&page=${this.pageNo}&entityType=${this.entityType}`,
      data: this.payload,
    };
    this.observationService.post(paramOptions).subscribe(
      (data) => {
        this.solutionList =
          data && data.result ? this.solutionList.concat(data.result.data) : [];
        this.paginationDetails.currentPage = this.pageNo;
        this.paginationDetails = this.paginationService.getPager(
          data.result.count,
          this.paginationDetails.currentPage,
          this.pageSize
        );
        this.showLoadMore =
          this.solutionList.length < data.result.count ? true : false;
      },
      (error) => {}
    );
  }

  changeLimit(e) {
    this.pageSize = e.target.value;
    this.pageNo=1;
    this.dtOptions.pageLength=this.pageSize;
    this.getSolutions();
  }

  goToEntityList(data) {
    this.solution = data;
    this.showModal = true;
  }

  goToReports(solution) {
    this.showModal = false;
    const state = {
      scores: false,
      observation: true,
      entityId: solution.entities[0]._id,
      entityType: solution.entityType,
      observationId: solution.observationId,
      solutionId: solution.solutionId,
      // entity:solution.entities[0]
    };
    if (solution.isRubricDriven) {
      state.scores = true;
    }
    if (!solution.criteriaLevelReport) {
      state['filter'] = { questionId: [] };
      state['criteriaWise'] = false;
    }
    this.router.navigate(['solution/report-view'], {
      queryParams: state,
    });
  }

  modalClose(event) {
    this.showModal = false;
    if (event.value) {
    const entity = event.value.selectedEntity;
    const solutionDetails = event.value.solutionDetail;
    const state = {
      scores: false,
      observation: true,
      entityId: entity._id,
      entityType: solutionDetails.entityType,
      observationId: solutionDetails.observationId,
      solutionId: solutionDetails.solutionId,
      // entity:entity
    };
    if (solutionDetails.isRubricDriven) {
      state.scores = true;
    }
    if (!solutionDetails.criteriaLevelReport) {
      state['filter'] = { questionId: [] };
      state['criteriaWise'] = false;
    }
    this.router.navigate(['solution/report-view'], {
      queryParams: state,
    });
  }
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().subscribe((layoutConfig) => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }
}
