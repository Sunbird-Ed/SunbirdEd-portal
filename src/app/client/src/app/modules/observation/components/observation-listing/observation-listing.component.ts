import {
  PaginationService,
  ResourceService,
  ConfigService,
  ToasterService,
  INoResultMessage,
  ICard,
  ILoaderMessage,
  UtilService,
  BrowserCacheTtlService,
  NavigationHelperService,
  IPagination,
  LayoutService,
  COLUMN_TYPE,
  OfflineCardService,
} from "@sunbird/shared";
import {
  SearchService,
  PlayerService,
  CoursesService,
  UserService,
  ISort,
  OrgDetailsService,
  SchemaService,
  KendraService
} from "@sunbird/core";
import { combineLatest, Subject, of } from "rxjs";
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash-es";
import {
  IInteractEventEdata,
  IImpressionEventInput,
  TelemetryService,
} from "@sunbird/telemetry";
import {
  takeUntil,
  map,
  delay,
  first,
  debounceTime,
  tap,
  mergeMap,
} from "rxjs/operators";
import { CacheService } from "ng2-cache-service";
import { ContentManagerService } from "../../../public/module/offline/services/content-manager/content-manager.service";
import { ObservationUtilService } from "../../service";
import {Location} from '@angular/common';

@Component({
  selector: "app-observation-listing",
  templateUrl: "./observation-listing.component.html",
  styleUrls: ["./observation-listing.component.scss"],
})
export class ObservationListingComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  pageTitleSrc = "resourceService?.frmelmnts?.lbl?.observation";
  svgToDisplay = "textbooks-banner-img.svg";
  contentList: any = [];
  public unsubscribe$ = new Subject<void>();
  layoutConfiguration: any;
  contentData;
  contentName: string;
  public inViewLogs = [];
  public telemetryImpression: IImpressionEventInput;
  public cardIntractEdata: IInteractEventEdata;
  public showLoader = true;
  public initFilters = false;
  isDesktopApp = false;
  selectedFilters: any;
  totalCount: any = 0;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  public allTabData;
  config;
  searchData: any = "";
  public numberOfSections = new Array(
    this.configService.appConfig.SEARCH.PAGE_LIMIT
  );
  public paginationDetails: IPagination;
  queryParam: any = {};
  showEditUserDetailsPopup:any= true;
  payload:any;
  constructor(
    public searchService: SearchService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public paginationService: PaginationService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService,
    public utilService: UtilService,
    public coursesService: CoursesService,
    private playerService: PlayerService,
    public userService: UserService,
    public cacheService: CacheService,
    public browserCacheTtlService: BrowserCacheTtlService,
    public orgDetailsService: OrgDetailsService,
    public navigationhelperService: NavigationHelperService,
    public layoutService: LayoutService,
    private schemaService: SchemaService,
    public contentManagerService: ContentManagerService,
    public telemetryService: TelemetryService,
    private offlineCardService: OfflineCardService,
    private kendraService: KendraService,
    config: ConfigService,
    private observationUtil:ObservationUtilService,
    private location:Location,
  ) {
    this.config = config;
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.paginationDetails = this.paginationService.getPager(0,1,this.configService.appConfig.SEARCH.PAGE_LIMIT);
  }

  async ngOnInit(){
    this.initLayout();
  
    this.showEditUserDetailsPopup=await this.observationUtil.getProfileInfo();
     if(!this.showEditUserDetailsPopup){
       let metaData=this.observationUtil.getAlertMetaData();
       metaData.type="update profile";
       metaData.isClosed=true;
       metaData.size="mini";
       metaData.content.title=this.resourceService.frmelmnts.alert.updateprofiletitle;
       metaData.content.body.type="text";
       metaData.content.body.data=this.resourceService.frmelmnts.alert.updateprofilecontent;
       metaData.footer.className="single-btn"
       metaData.footer.buttons.push(
        {
          type:"accept",
          returnValue:true,
          buttonText:this.resourceService.frmelmnts.btn.update,
          className:"popup-btn"
        }
        );
      let returnData=await this.observationUtil.showPopupAlert(metaData);
      if(returnData){
        let queryParam = {
          showEditUserDetailsPopup:true
        }
       this.router.navigate(['profile'],{queryParams:queryParam});
      }
      return;
     }
     this.activatedRoute.queryParams.subscribe((params) => {
      if (params["key"]) {
        this.searchData = params["key"];
        return this.fetchContentList();
      }
      this.searchData="";
      this.fetchContentList();
    });
  }

  async getProfileCheck(){
    await this.observationUtil.getProfileInfo()
    .then((result:any)=>{
      return result;
    });
  }

  getDataParam(){
    this.observationUtil.getProfileDataList()
    .then((result:any)=>{
      this.payload=result;
    })
  }

  back():void{
    this.location.back();
  }

  async fetchContentList(page = 1) {
    await this.getDataParam();
    const paramOption = {
      url: this.config.urlConFig.URLS.OBSERVATION.OBSERVATION_LISTING,
      param: { page: page, limit: 20, search: this.searchData },
      data: this.payload
    };

    this.kendraService.post(paramOption).subscribe(
      (data: any) => {
        this.totalCount = data.result.count;
        this.paginationDetails.currentPage = page;
        this.paginationDetails = this.paginationService.getPager(
          data.result.count,
          this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT
        );
        this.setFormat(data.result.data);
      },
      (error) => {}
    );
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    this.fetchContentList(page);
  }

  setFormat(data) {
    let result = [];
    this.contentList = [];

    data.forEach((value) => {
      let solution_name:string = value.name;
      solution_name = (solution_name && solution_name.length) ? solution_name[0].toUpperCase() + solution_name.slice(1): "";
      const subject:any=[];
      subject.push(value.programName.toString())
      let obj = {
        name: solution_name,
        contentType: "Observation",
        metaData: {
          identifier: value.solutionId,
        },
        identifier: value.solutionId,
        solutionId: value.solutionId,
        programId: value.programId,
        medium: value.language,
        organization: value.creator,
        _id: value._id,
        subject:subject
      };
      result.push(obj);
      this.contentList = result;
    });
    this.showLoader = false;
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.layoutService
      .switchableLayout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((layoutConfig) => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }
  redoLayout() {
    if (this.layoutConfiguration != null) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        0,
        this.layoutConfiguration,
        COLUMN_TYPE.threeToNine,
        true
      );
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        1,
        this.layoutConfiguration,
        COLUMN_TYPE.threeToNine,
        true
      );
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        0,
        null,
        COLUMN_TYPE.fullLayout
      );
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(
        1,
        null,
        COLUMN_TYPE.fullLayout
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }

  private setTelemetryData() {
    this.inViewLogs = []; // set to empty every time filter or page changes
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.userService.slug
          ? "/" + this.userService.slug + this.router.url
          : this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationhelperService.getPageLoadTime(),
      },
    };
    this.cardIntractEdata = {
      id: "content-card",
      type: "click",
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
    };
  }

  playContent(event) {
    let data = event.data;
    this.queryParam = {
      programId: data.programId,
      solutionId: data.solutionId,
      observationId: data._id,
      solutionName: data.name,
      programName:data.subject[0]
    };
    this.router.navigate(["observation/details"], {
      queryParams: this.queryParam,
    });
  }

  public inView(event) {
    _.forEach(event.inview, (elem, key) => {
      const obj = _.find(this.inViewLogs, {
        objid: elem.data.metaData.identifier,
      });
      if (!obj) {
        this.inViewLogs.push({
          objid: elem.data.metaData.identifier,
          objtype: elem.data.metaData.contentType || "content",
          index: elem.id,
        });
      }
    });
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inViewLogs;
      this.telemetryImpression.edata.subtype = "pageexit";
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }

  hoverActionClicked(event) {
    event["data"] = event.content;
    this.contentName = event.content.name;
    this.contentData = event.data;
    let telemetryButtonId: any;
  }

  logTelemetry(content, actionId) {
    const telemetryInteractObject = {
      id: content.identifier,
      type: content.contentType,
      ver: content.pkgVersion ? content.pkgVersion.toString() : "1.0",
    };

    const appTelemetryInteractData: any = {
      context: {
        env:
          _.get(
            this.activatedRoute,
            "snapshot.root.firstChild.data.telemetry.env"
          ) ||
          _.get(this.activatedRoute, "snapshot.data.telemetry.env") ||
          _.get(
            this.activatedRoute.snapshot.firstChild,
            "children[0].data.telemetry.env"
          ),
      },
      edata: {
        id: actionId,
        type: "click",
        pageid: this.router.url.split("/")[1] || "Search-page",
      },
    };

    if (telemetryInteractObject) {
      if (telemetryInteractObject.ver) {
        telemetryInteractObject.ver = _.isNumber(telemetryInteractObject.ver)
          ? _.toString(telemetryInteractObject.ver)
          : telemetryInteractObject.ver;
      }
      appTelemetryInteractData.object = telemetryInteractObject;
    }
    this.telemetryService.interact(appTelemetryInteractData);
  }

}