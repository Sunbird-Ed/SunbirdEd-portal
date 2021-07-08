import { ConfigService, ResourceService, LayoutService,PaginationService,IPagination,ILoaderMessage,INoResultMessage} from "@sunbird/shared";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as _ from "lodash-es";
import { of, Observable, throwError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import * as $ from "jquery";
import "datatables.net";
import { ObservationUtilService } from "../../../observation/service";
import { ObservationService, UserService } from "@sunbird/core";

@Component({
  selector: "app-solution-listing",
  templateUrl: "./solution-listing.component.html",
  styleUrls: ["./solution-listing.component.scss"],
})
export class SolutionListingComponent implements OnInit {
  public reportsList$: Observable<any>;
  public noResultFoundError: string;
  private _isUserReportAdmin: boolean;
  layoutConfiguration: any;
  config;
  payload;
  entityType: string = "";
  pageSize: number = 10;
  pageNo: number = 1;
  solutionList = [];
  showLoadMore: boolean = true;
  filters=[];
  selectedEntity: any;
  dtOptions: any = {};
  showModal:boolean=false;
  solution:any;
  public paginationDetails: IPagination;
  public loaderMessage: ILoaderMessage;
  public noResultMessage: INoResultMessage;
  showLoader=true;
  noResult=false;
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
  ) {
    this.config = config;
    this.paginationDetails = this.paginationService.getPager(0,1,this.pageSize);
    this.noResultMessage = {
      'messageText':  'messages.stmsg.m0131'
    };
  }

  ngOnInit() {
    this.dtOptions = {
      autoWidth: true,
      searching:false,
      info:false,
      dom:'<"pull-right">rt'
    };
    this.selectedEntity="selected";
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
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
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
        if(data.result){
          this.showLoader=false;
        }
        else{
          this.showLoader=false;
          this.noResult=true;
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
      },
      (error) => {
        this.showLoader=false;
          this.noResult=true;
      }
    );
  }

  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    this.pageNo=page;
    this.getSolutions();
  }

  getDataByEntity(e) {
    this.selectedEntity = e.target.value;
    this.entityType=this.selectedEntity;
    this.pageNo=1;
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

  changeLimit(e){
    this.pageSize=e.target.value;
    this.getSolutions();
  }
 
  goToEntityList(data){
    this.solution=data;
    this.showModal=true;
  }

  goToReports(solution){
    this.showModal=false;
    let state = {
      scores: false,
      observation: true,
      entityId: solution.entities[0]._id,
      entityType: solution.entityType,
      observationId: solution.observationId,
      solutionId:solution.solutionId,
      // entity:solution.entities[0]
    };
    if (solution.isRubricDriven) {
      state.scores = true;
    }
    if (!solution.criteriaLevelReport) {
      state['filter'] = { questionId: [] };
      state['criteriaWise'] = false;
    }
    this.router.navigate(["solution/report-view"], {
      queryParams: state,
    });
  }

  modalClose(event){
    this.showModal=false;
    if(event.value){
    let entity=event.value.selectedEntity;
    let solutionDetails=event.value.solutionDetail;
    let state = {
      scores: false,
      observation: true,
      entityId: entity._id,
      entityType: solutionDetails.entityType,
      observationId:solutionDetails.observationId,
      solutionId:solutionDetails.solutionId,
      // entity:entity
    };
    if (solutionDetails.isRubricDriven) {
      state.scores = true;
    }
    if (!solutionDetails.criteriaLevelReport) {
      state['filter'] = { questionId: [] };
      state['criteriaWise'] = false;
    }
    this.router.navigate(["solution/report-view"], {
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
