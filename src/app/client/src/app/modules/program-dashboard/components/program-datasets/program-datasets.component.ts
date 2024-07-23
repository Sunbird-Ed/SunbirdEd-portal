import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INoResultMessage, ToasterService, IUserData, IUserProfile, LayoutService, ResourceService, ConfigService, OnDemandReportService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject, Subscription, throwError ,Observable, of, combineLatest, queueScheduler} from 'rxjs';
import { KendraService, UserService, FormService } from '@sunbird/core';
import { mergeMap, switchMap, takeUntil,map, catchError} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Location } from '@angular/common';
import { ReportService } from '../../../dashboard/services';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { Md5 } from 'ts-md5';
import { HttpErrorResponse } from '@angular/common/http';

const PRE_DEFINED_PARAMETERS = ['$slug', 'hawk-eye'];

// Minimum Date for Time Range Filters
const ALL_REPORTS_MIN_START_DATE = '2020-01-01';
const ALL_REPORTS_MIN_END_DATE = '2020-01-02';
export interface ConfigFilter{
    label: string,
    controlType: string,
    reference: string,
    defaultValue: number
}
export interface ResourceAPIRequestBody{
  type:string,
  id:string,
  projection:string,
  solutionType?:string,
  districtLocationId?:string
}
@Component({
  selector: 'app-datasets',
  templateUrl: './program-datasets.component.html',
  styleUrls: ['./program-datasets.component.scss'],
})
export class DatasetsComponent implements OnInit, OnDestroy {
  public activatedRoute: ActivatedRoute;
  public showConfirmationModal = false;
  public dashboardReport$;
  public noResultMessage: INoResultMessage;
  public noResult: boolean;
  showPopUpModal: boolean;
  config;
  reportTypes = [];
  programs = [];
  solutions = [];
  public message = this.resourceService?.frmelmnts?.msg?.noDataDisplayed;
  instance: string;
  @ViewChild('reportSection') reportSection;
  public reportExportInProgress = false;
  @ViewChild('modal', { static: false }) modal;
  popup = false;
  awaitPopUp = false;
  reportStatus = {
    'submitted': 'SUBMITTED',
    'processing': 'PROCESSING',
    'failed': 'FAILED',
    'success': 'SUCCESS',
  };

  public isProcessed = false;
  formData: Object;
  public columns = [
    { name: 'Report type', isSortable: true, prop: 'datasetConfig.title', placeholder: 'Filter report type' },
    { name: 'Request date', isSortable: true, prop: 'jobStats.dtJobSubmitted', placeholder: 'Filter request date', type: 'date' },
    { name: 'Status', isSortable: false, prop: 'status', placeholder: 'Filter status' },
    { name: 'Report link', isSortable: false, prop: 'downloadUrls', placeholder: 'Filter download link' },
    { name: 'Generated date', isSortable: true, prop: 'jobStats.dtJobCompleted', placeholder: 'Filter generated date', type: 'dateTime' },
  ];

  public onDemandReportData = [];

  downloadCSV = true;
  isColumnsSearchable = false;
  tag: string;

  reportForm = new UntypedFormGroup({
    programName: new UntypedFormControl('', [Validators.required]),
    solution: new UntypedFormControl(),
    reportType: new UntypedFormControl('', [Validators.required]),
    districtName: new UntypedFormControl(),
    organisationName: new UntypedFormControl(),
    startDate: new UntypedFormControl(),
    endDate: new UntypedFormControl(),
    blockName:new UntypedFormControl()
  });

  passwordForm = new UntypedFormGroup({
    password: new UntypedFormControl('', [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
  });
  programSelected: any;
  solutionSelected: any;
  districts: any;
  organisations: any = [];
  filter: any = [];
  newData: boolean = false;
  goToPrevLocation: boolean = true;
  reportConfig: any;
  chartsReportData: any;
  exportOptions = ['Pdf', 'Img'];
  hideElements: boolean = false;
  globalDistrict: any;
  globalOrg: any;
  tabIndex: number = 0;
  tableToCsv: boolean;
  hideTableToCsv:boolean = true;
  minEndDate: any;  //Min end date - has to be one more than start date 
  maxEndDate: any;  //Max end date -  current date has to be max
  maxStartDate: any; //Start date - has to be one day less than end date
  displayFilters:any = {};
  loadash = _;
  pdFilters:ConfigFilter[] = [];
  configuredFilters:any = {};
  appliedFilters:object = {};
  blocks:object[] = [];
  errorMessage = this.resourceService?.frmelmnts?.lbl?.resourceSelect;
  solutionType: any;
  showErrorForGraphs: boolean = false;
  minStartDate: Date;
  constructor(
    activatedRoute: ActivatedRoute,
    public layoutService: LayoutService,
    public telemetryService: TelemetryService,
    public resourceService: ResourceService,
    public kendraService: KendraService,
    public userService: UserService,
    public onDemandReportService: OnDemandReportService,
    config: ConfigService,
    public toasterService: ToasterService,
    public formService: FormService,
    public router: Router,
    public location: Location,
    public reportService: ReportService,
    private cd:ChangeDetectorRef
  ) {
    this.config = config;
    this.activatedRoute = activatedRoute;
  }

  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();
  userDataSubscription: Subscription;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * all user role
   */
  public userRoles: Array<string> = [];
  public userId: string;
  public selectedReport;
  public selectedSolution: string;
  public userAccess:boolean;
  hashedTag;
  oldProgram;
  getProgramsList() {
    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.PROGRAMS_BY_PLATFORM_ROLES + '?role=' + this.userRoles.toString()
    };
    this.kendraService.get(paramOptions).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data && data.result) {
        this.programs = data.result;
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });

  }

  getSolutionList(program) {

    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.SOLUTIONS_BY_PROGRAMID + '/' + program._id + '?role=' + program.role[0]
    };
    this.kendraService.get(paramOptions).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data && data.result) {
        this.solutions = data.result;
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });

  }

  getDistritAndOrganisationList(requestBody:ResourceAPIRequestBody) {

    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.DISTRICTS_AND_ORGANISATIONS+`?resourceType=${requestBody.type}&resourceId=${requestBody.id}`,
      data: {
        projection: requestBody.projection,
        ...(requestBody.solutionType) && {solutionType:requestBody.solutionType},
        ...(requestBody.districtLocationId) && {query : {districtLocationId:requestBody.districtLocationId}},
        programId:  _.get(this.reportForm, 'controls.programName.value')
      }
    };

    this.kendraService.post(paramOptions).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data && Object.keys(data.result).length) {
        const processData = (result) => {
          if (result) {
            return result.filter(data => data?.name !== null);
          }
          return []
        };
        
       if(requestBody.projection !== 'block'){
        this.organisations = processData(data.result.organisations);
        this.districts = processData(data.result.districts);
       }
        this.blocks = processData(data.result.block);     
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });

  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  ngOnInit() {
    this.showPopUpModal = true;
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userRoles = user.userProfile.userRoles;
          this.userId = user.userProfile.id;

        }
      });
    this.initLayout();
    this.getProgramsList();
    this.getFormDetails();
    this.timeRangeInit();
  }

  timeRangeInit() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const today = new Date().getDate();
    this.minEndDate = new Date(ALL_REPORTS_MIN_END_DATE);
    this.maxEndDate = new Date(currentYear + 0, currentMonth, today);
    this.maxStartDate = new Date(currentYear + 0, currentMonth, today - 1);
    this.minStartDate = new Date(ALL_REPORTS_MIN_START_DATE);
    this.reportForm.controls?.startDate.reset();
    this.reportForm.controls?.endDate.reset();
  }

  public resolveParameterizedPath(path: string, explicitValue?: string): string {
    return _.reduce(PRE_DEFINED_PARAMETERS, (result: string, parameter: string) => {
      if (_.includes(result, parameter)) {
        result = _.replace(result, parameter, explicitValue);
      }
      return result;
    }, path);
  }

  public getUpdatedParameterizedPath(dataSources) {
    const explicitValue = !this.reportForm.controls.solution.value ? _.get(this.reportForm, 'controls.programName.value') : _.get(this.reportForm, 'controls.solution.value')
    return _.map(dataSources, (dataSource) => ({
      id: dataSource.id,
      path: this.resolveParameterizedPath(dataSource.path, explicitValue)
    }));
  }
  
  selectedTabChange(event) {
    this.tabIndex = event.index;
  }

  public programSelection($event) {
    this.reportForm.reset();
    this.displayFilters = {};
    const program = this.programs.filter(data => {
      if (data._id == $event.value) {
        return data;
      }
    });
    this.solutions = [];
    this.reportTypes = [];
    this.onDemandReportData = [];
    this.resetConfigFilters();
    this.timeRangeInit();
    this.getSolutionList(program[0]);
    this.displayFilters['Program'] = [program[0].name]
    this.reportForm.controls.programName.setValue($event.value);
    this.appliedFilters = {};
    this.districts = this.organisations = this.blocks = [];
    this.errorMessage = this.resourceService?.frmelmnts?.lbl?.resourceSelect;
    this.getReportTypes($event.value,'user_detail_report');
    this.oldProgram = !_.has(program[0],'requestForPIIConsent')
    this.userAccess = this.reportTypes.length > 0 && _.has(program[0],'requestForPIIConsent');
    if(this.userAccess){
      this.tag = program[0]._id + '_' + this.userId;
      this.hashedTag = this.hashTheTag(this.tag)
      this.loadReports();
    }
    this.newData = !this.userAccess;
    this.showErrorForGraphs = false;
    const requestBody:ResourceAPIRequestBody= {
      type:'program',
      id:$event.value,
      projection:'district'
    }
    this.getDistritAndOrganisationList(requestBody);
  }

  public selectSolution($event) {
    this.newData = false;
    this.showErrorForGraphs = false;
    this.noResult = false;
    this.districts = this.organisations = []
    this.userAccess = true;
    this.resetConfigFilters();
    this.timeRangeInit();
    delete this.displayFilters['District'];
    delete this.displayFilters['Organisation'];
    this.errorMessage = this.resourceService?.frmelmnts?.lbl?.resourceSelect;
    this.appliedFilters = {}
    if (this.programSelected && this.reportForm.value && this.reportForm.value['solution']) {
      const solution = this.solutions.filter(data => {
        if (data._id == $event.value) {
          return data;
        }
      });
      this.tag = solution[0]._id + '_' + this.userId;
      this.hashedTag = this.hashTheTag(this.tag)
      this.loadReports();

      const program = this.programSelected;
      this.reportForm.reset();
      this.reportForm.controls.solution.setValue($event.value);
      this.reportForm.controls.programName.setValue(program);
      this.displayFilters['Resource'] = [$event?.source?.triggerValue]
      if (solution[0].isRubricDriven === true && solution[0].type === 'observation') {
        const type = solution[0].criteriaLevelReport ? solution[0].type + '_with_rubric' : solution[0].type + '_with_rubric_no_criteria_level_report'
        this.getReportTypes(this.programSelected, type);
      } else {
        this.getReportTypes(this.programSelected, solution[0].type);
      }
      this.solutionType = solution[0].type
      const requestBody:ResourceAPIRequestBody = {
        type:'solution',
        id:$event.value,
        projection:'district',
        solutionType:this.solutionType
      }
      this.getDistritAndOrganisationList(requestBody);


    }
  }

  public getReportTypes(programId, solutionType) {
    this.reportTypes = [];
    let selectedProgram = this.programs.filter(program => program._id == programId);
    if (selectedProgram && selectedProgram[0]) {
      let role = selectedProgram[0]['role'];
      let types = this.formData[solutionType];

      let filtersForReport = {
        "reportconfig.report_type": "program_dashboard",
        "reportconfig.solution_type": `${(solutionType === 'improvementProject') ? "project" : solutionType}`,
        "reportconfig.report_status": "active"
      }

      this.dashboardReport$ = this.renderReport(filtersForReport).pipe(
        catchError(err => {
          console.error('Error while rendering report', err);
          this.noResultMessage = {
            'messageText': _.get(err, 'messageText') || 'messages.stmsg.m0131'
          };
          this.noResult = true;
          return of({});
        })
      );

      if (types && types.length > 0) {
        types.forEach(element => {
          let roleMatch = role.some(e => element.roles.includes(e));
          if (roleMatch) {
            this.reportTypes.push(element);
          }
        });
      }
    }
  }

  fetchConfig(filters): Observable<any> {
    return this.reportService.listAllReports(filters).pipe(
      mergeMap(apiResponse => {
        const report = _.get(apiResponse, 'reports');
        return report ? of(_.head(report)) : throwError('No report found');
      })
    );
  }

  renderReport(reportId): Observable<any> {
    return this.fetchConfig(reportId).pipe(switchMap(
      (report => {
        const reportConfig = this.reportConfig = _.get(report, 'reportconfig');
        const dataSource = _.get(reportConfig, 'dataSource') || [];
        let updatedDataSource = _.isArray(dataSource) ? dataSource : [{ id: 'default', path: dataSource }];
        updatedDataSource = this.getUpdatedParameterizedPath(updatedDataSource);
        const charts = _.get(reportConfig, 'charts'), tables = _.get(reportConfig, 'table')
        return this.reportService.downloadMultipleDataSources(updatedDataSource).pipe(map((apiResponse) => {
          const data = apiResponse;
          const result: any = Object.assign({});
          const chart = (charts && this.reportService.prepareChartData(charts, data, updatedDataSource,
            _.get(reportConfig, 'reportLevelDataSourceId'))) || [];
          result['charts'] = chart;
          result['tables'] = (tables && this.prepareTableData(tables, data, _.get(reportConfig, 'downloadUrl'))) || [];
          this.hideTableToCsv = (result?.tables[0]?.data != undefined) ? true : false;
          result['reportMetaData'] = reportConfig;
          result['lastUpdatedOn'] = this.reportService.getFormattedDate(this.reportService.getLatestLastModifiedOnDate(data));
          this.chartsReportData = JSON.parse(JSON.stringify(result));
          //adding for debugging purpose for now
          console.log('report result',result)
          return result;
        }))
      })
    ))
  }

  prepareTableData(tablesArray: any, data: any, downloadUrl: string): Array<{}> {
    tablesArray = _.isArray(tablesArray) ? tablesArray : [tablesArray];
    return _.map(tablesArray, table => {
      const tableId = _.get(table, 'id') || `table-${_.random(1000)}`;
      const dataset = this.getTableData(data, _.get(table, 'id'));
      const tableData: any = {};
      tableData.id = tableId;
      tableData.name = _.get(table, 'name') || 'Table';
      tableData.config = _.get(table, 'config') || false;
      tableData.data = dataset.data;
      let columns = []
      tableData.header = _.get(table, 'columns') || _.get(dataset, _.get(table, 'columnsExpr'));
      tableData.header && tableData.header.map((col) => {
        let obj = { title: col, data: col }
        columns.push(obj);
      })
      tableData.columnsConfiguration = {
        columnConfig: columns,
        bLengthChange: true,
        info: true,
        lengthMenu: [10, 25, 50, 100],
        paging: true,
        searchable: true
      }
      tableData.downloadUrl = this.resolveParameterizedPath(_.get(table, 'downloadUrl') || downloadUrl, (this.userAccess && !this.reportForm.controls.solution.value ? _.get(this.reportForm, 'controls.programName.value') : _.get(this.reportForm, 'controls.solution.value')));
      return tableData;

    });
  }

  getTableData(data: { result: any, id: string }[], tableId) {
    if (data.length === 1) {
      const [dataSource] = data;
      if (dataSource.id === 'default') {
        return dataSource.result;
      }
    }
    return this.getDataSourceById(data, tableId) || {};
  }

  getDataSourceById(dataSources: { result: any, id: string }[], id: string = 'default') {
    return _.get(_.find(dataSources, ['id', id]), 'result');
  }

  downloadReport(reportType) {
    this.reportExportInProgress = true;
    this.toggleHtmlVisibilty(true);
    setTimeout(() => {
      switch (_.toLower(_.get(reportType, 'value'))) {
        case 'img': {
          this.downloadReportAsImage();
          break;
        }
        case 'pdf': {
          this.downloadReportAsPdf();
          break;
        }
      }
    })
  }

  private convertHTMLToCanvas(element, options) {
    return html2canvas(element, options);
  }

  downloadReportAsPdf() {
    this.convertHTMLToCanvas(this.reportSection.nativeElement, {
      scrollX: 0,
      scrollY: -window.scrollY,
      scale: 2
    }).then(canvas => {
      const imageURL = canvas.toDataURL('image/jpeg');
      const pdfFormat = new jsPDF('p', 'px', 'a4');
      const docWidth = pdfFormat.internal.pageSize.getWidth();
      const imageHeight = (canvas.height * docWidth) / canvas.width;
      pdfFormat.internal.pageSize.height = imageHeight;
      pdfFormat.addImage(imageURL, 'JPEG', 10, 8, docWidth - 28, imageHeight - 24);
      pdfFormat.save('report.pdf');
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
    }).catch(_err => {
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
    });
  }

  downloadReportAsImage() {
    this.convertHTMLToCanvas(this.reportSection.nativeElement, {
      scrollX: 0,
      scrollY: -window.scrollY,
      scale: 2
    }).then(canvas => {
      const imageURL = canvas.toDataURL('image/jpeg');
      const anchorElement = document.createElement('a');
      anchorElement.href = imageURL.replace('image/jpeg', 'image/octet-stream');
      anchorElement.download = 'report.jpg';
      anchorElement.click();
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
    }).catch(_err => {
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
    });
  }

  private toggleHtmlVisibilty(flag: boolean): void {
    this.hideElements = flag;
  }

  public closeModal(): void {
    this.popup = false;
  }

  public csvRequest() {
    this.popup = false;
    this.submitRequest();
  }

  public requestDataset() {
    if (this.selectedReport.encrypt == true) {
      this.popup = true;
    } else {
      this.showConfirmationModal = true;
    }
  }

  private closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  goBack() {
    this.goToPrevLocation ? this.location.back() : (this.showPopUpModal = false);
  }

  confirm() {
    this.showPopUpModal = false;
  }
  public handleConfirmationEvent(event: boolean) {
    this.closeConfirmationModal();
    if (event == true) {
      this.submitRequest();
    }
  }
  public closeConfirmModal() {
    this.awaitPopUp = false;
  }

  public resetFilter() {
    this.reportForm.reset();
    this.filter = [];
    this.districts = [];
    this.organisations = [];
    this.solutions = [];
    this.reportTypes = [];
    this.onDemandReportData = [];
    this.goToPrevLocation = false;
    this.showPopUpModal = true;
    this.appliedFilters = {}
    this.displayFilters = {};
    this.timeRangeInit();
    this.resetConfigFilters();
  }

  loadReports() {
    const requestWithUnhashedTag = this.onDemandReportService.getReportList(this.tag);
    const requestWithHashedTag = this.onDemandReportService.getReportList(this.hashedTag);

    combineLatest([
      requestWithHashedTag.pipe(catchError((err) => of(err))),
      requestWithUnhashedTag.pipe(catchError((err) => of(err))),
    ])
      .pipe(
        map(([response1, response2]: [any, any]) => {
          const jobs1 = response1 instanceof HttpErrorResponse ? null : response1?.result?.jobs || null;
          const jobs2 = response2 instanceof HttpErrorResponse ? null : response2?.result?.jobs || null;

          if (jobs1 === null && jobs2 === null) {
            throw new Error("Both job requests failed");
          }
          const jobs = _.compact(_.concat(jobs1, jobs2));
          return jobs;
        }),
        catchError((error) => {
          this.toasterService.error(
            _.get(this.resourceService, "messages.fmsg.m0004")
          );
          return throwError("Report list APIs failed", queueScheduler);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((reportData: object[]) => {
        this.onDemandReportData = reportData.length
          ? _.map(reportData, (row) => this.dataModification(row))
          : [];
      });
  }

  districtSelection($event) {
    this.newData = false;
    this.showErrorForGraphs = false
    this.appliedFilters = {...this.appliedFilters, district_externalId: $event.value};
    this.timeRangeInit();
    if(_.has(this.appliedFilters,'block_externalId')) delete this.appliedFilters['block_externalId'];
    this.reportForm.controls.districtName.setValue($event.value);
    this.errorMessage = this.resourceService?.frmelmnts?.lbl?.resourceSelect;
    this.displayFilters['District'] = [$event?.source?.triggerValue];
    const requestBody:ResourceAPIRequestBody = {
      type:_.get(this.reportForm, 'controls.solution.value') ? 'solution' : 'program',
      id:_.get(this.reportForm, 'controls.solution.value') || _.get(this.reportForm, 'controls.programName.value'),
      projection:'block',
      districtLocationId:$event.value,
      ...(_.get(this.reportForm, 'controls.solution.value')) && {solutionType : this.solutionType}

    }
    this.getDistritAndOrganisationList(requestBody);
    const tagBasedOnUserAccess = ((this.userAccess  && !(_.get(this.reportForm, 'controls.solution.value')))? _.get(this.reportForm, 'controls.programName.value') : _.get(this.reportForm, 'controls.solution.value'));
    this.tag = tagBasedOnUserAccess + '_' + this.userId+'_'+ _.toLower(_.trim([$event?.source?.triggerValue]," "));
    this.hashedTag = this.hashTheTag( tagBasedOnUserAccess + '_' + this.userId+'_'+ $event.value);
    this.loadReports();
  }

  organisationSelection($event) {
    this.appliedFilters= {...this.appliedFilters, organisation_id:$event.value}
    this.reportForm.controls.organisationName.setValue($event.value);
    this.displayFilters['Organisation'] = [$event?.source?.triggerValue]
    this.newData = false;
    this.showErrorForGraphs = false;
    this.errorMessage = this.resourceService?.frmelmnts?.lbl?.resourceSelect;
  }

  blockChanged($event){
    this.reportForm.controls.blockName.setValue($event.value)
    if($event.value.length){
      this.appliedFilters = {...this.appliedFilters, block_externalId:$event.value};
      this.displayFilters['Block'] = [$event?.source?.triggerValue];
      const tagBasedOnUserAccess = (this.userAccess ? _.get(this.reportForm, 'controls.programName.value') : _.get(this.reportForm, 'controls.solution.value'))
      this.tag = tagBasedOnUserAccess + '_' + this.userId+'_'+ _.get(this.reportForm, 'controls.districtName.value') + ($event.value).sort();
      this.hashedTag = this.hashTheTag(this.tag);
      this.loadReports();
    }else{
      delete this.appliedFilters['block_externalId']
      this.appliedFilters = { ...this.appliedFilters }
    }
  }
  dependentFilterMsg(){
    if(!this.reportForm.controls.districtName.value){
      this.newData = true;
      this.errorMessage = this.resourceService?.frmelmnts?.lbl?.blockWithoutDistrict;
      this.showErrorForGraphs = true;
    }
  }

  reportChanged(selectedReportData) {
    this.resetConfigFilters();
    this.selectedReport = selectedReportData;
    if(this.selectedReport.configurableFilters){
      this.pdFilters = this.selectedReport.uiFilters;
      this.pdFilters.map(filter => {
        if(filter['controlType'] === 'number'){
          this.configuredFilters[filter['reference']] = filter['defaultValue'] as number -1
        }else if(filter['controlType'] === 'multi-select'){
          this.configuredFilters[filter['reference']] = undefined
        }
      })
    }
  }
  
  resetConfigFilters(){
    this.pdFilters = [];
    this.configuredFilters = {};
  }

  pdFilterChanged($event){
    if($event.data){
      const [reference, value]= [Object.keys($event.data),Object.values($event.data)] ;
      if($event.controlType === 'number'){
        if([0,null].includes(value[0] as number) || value[0] as number < 0){
          this.configuredFilters[reference[0]] = undefined;
        }else{
          this.configuredFilters[reference[0]] = value[0] as number -1;
        }
      }else if($event.controlType === 'multi-select'){
          if((value[0] as string[]).length){
            this.configuredFilters[reference[0]] = value[0]
          }else{
            this.configuredFilters[reference[0]] = undefined;
          }
      }
    }
  }

  addFilters() {
    this.pdFilters.map(filter => {
     if(filter['controlType'] === 'multi-select' && this.configuredFilters[filter['reference']] === undefined){
      this.configuredFilters[filter['reference']] = filter['options']
      }
    })
    const filterKeysObj = {
      "program_id": _.get(this.reportForm, 'controls.programName.value') || undefined,
      "solution_id": _.get(this.reportForm, 'controls.solution.value') || undefined,
      "programId": _.get(this.reportForm, 'controls.programName.value') || undefined,
      "solutionId": _.get(this.reportForm, 'controls.solution.value') || undefined,
      "district_externalId": _.get(this.reportForm, 'controls.districtName.value') || undefined,
      "district_id":_.get(this.reportForm, 'controls.districtName.value') || undefined,
      "organisation_id": _.get(this.reportForm, 'controls.organisationName.value') || undefined,
      "object_id":_.get(this.reportForm, 'controls.programName.value') || undefined,
      "user_locations['district_id']":_.get(this.reportForm, 'controls.districtName.value') || undefined,
      '>=':_.get(this.reportForm,'controls.startDate.value') || undefined,
      '<=':_.get(this.reportForm,'controls.endDate.value') || undefined,
      ...this.configuredFilters
    }
    const keys = Object.keys(filterKeysObj);
    this.dataFilterQuery(filterKeysObj,keys);
  }
  submitRequest() {
    this.addFilters();
    this.selectedSolution = this.reportForm.controls.solution.value;
    const isRequestAllowed = this.checkStatus();
    if (isRequestAllowed) {
      this.isProcessed = false;
      const config = {
        type: this.selectedReport['datasetId'],
        params: {
          ...((_.get(this.reportForm, 'controls.startDate.value') && _.get(this.reportForm, 'controls.solution.value')) && { 'start_date': _.get(this.reportForm, 'controls.startDate.value') }),
          ...((_.get(this.reportForm, 'controls.endDate.value') && _.get(this.reportForm, 'controls.solution.value') ) && { 'end_date': _.get(this.reportForm, 'controls.endDate.value') }),
          filters: this.filter
        },
        title: this.selectedReport.name
      };
      const request = {
        request: {
          dataset: this.selectedReport['dataset'],
          tag: this.hashedTag,
          requestedBy: this.userId,
          datasetConfig: config,
          output_format: 'csv'

        }
      };

      if (this.selectedReport.encrypt === true) {
        request.request['encryptionKey'] = this.passwordForm.controls.password.value;
      }

      this.onDemandReportService.submitRequest(request).subscribe((data: any) => {
        if (data && data.result) {
          if (data.result.status === this.reportStatus.failed) {
            const error = _.get(this.resourceService, 'frmelmnts.lbl.reportRequestFailed');
            this.toasterService.error(error);
          } else {

            if (data['result'] && data['result']['requestId']) {

              const dataFound = this.onDemandReportData.filter(function (submittedReports) {
                if (submittedReports['requestId'] == data['result']['requestId']) {
                  return data;
                }

              });
              if (dataFound && dataFound.length > 0) {
                this.popup = false;
                this.isProcessed = true;
                setTimeout(() => {
                  this.isProcessed = false;
                }, 5000);
                this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.reportRequestFailed'));
                this.passwordForm.reset();

              } else {
                data = this.dataModification(data['result']);
                const updatedReportList = [data, ...this.onDemandReportData];
                this.onDemandReportData = updatedReportList;
                this.awaitPopUp = true;
                this.passwordForm.reset();

              }
            }
          }

        }
      }, error => {
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      });
      this.filter = [];

    } else {
      this.popup = false;
      this.isProcessed = true;
      this.filter = [];
      setTimeout(() => {
        this.isProcessed = false;
      }, 10000);
      this.toasterService.error(_.get(this.resourceService, 'frmelmnts.lbl.reportRequestFailed'));
      this.passwordForm.reset();
    }
  }

  public getFormDetails() {

    const formServiceInputParams = {
      formType: 'program-dashboard',
      formAction: 'reportData',
      contentType: 'csv-dataset',
      component: 'portal'
    };

    this.formService.getFormConfig(formServiceInputParams).subscribe((formData) => {
      if (formData) {
        this.formData = formData;
      }
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }

  checkStatus() {
    let requestStatus = true;
    const selectedReportList = [];
    _.forEach(this.onDemandReportData, (value) => {
      if (value.datasetConfig.type === this.selectedReport.datasetId){
        _.forEach(value.datasetConfig.params.filters, (filter) => {
          const conditionForSolutionBasedReports = ['solutionId','solution_id'].includes(filter['dimension']) && filter.value  === this.selectedSolution
          const conditionForProgramBasedReports = ['object_id'].includes(filter?.table_filters?.[0]['name']) && filter?.table_filters?.[0].value === this.reportForm.controls.programName.value
          if(conditionForSolutionBasedReports || conditionForProgramBasedReports){
            selectedReportList.push(value);
          }
        });
      }
    });
    const sortedReportList = _.sortBy(selectedReportList, [(data) => {
      return data && data.jobStats && data.jobStats.dtJobSubmitted;
    }]);

    const reportListData = _.last(sortedReportList) || {};
    if (!_.isEmpty(reportListData)) {
      const isInProgress = this.onDemandReportService.isInProgress(reportListData, this.reportStatus);
      if (!isInProgress) {
        requestStatus = true;
      } else {
        requestStatus = false;
      }
    }
    return requestStatus;
  }
  onDownloadLinkFail(data) {
    const tagId = data && data.tag && data.tag.split(':');
    this.onDemandReportService.getReport(_.head(tagId), data.requestId).subscribe((data: any) => {
      if (data) {
        const downloadUrls = _.get(data, 'result.downloadUrls') || [];
        const downloadPath = _.head(downloadUrls);
        if (downloadPath) {
          window.open(downloadPath, '_blank');
        } else {
          this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
        }
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }
  dataModification(row) {
    row.title = row.datasetConfig.title;
    return row;
  }

  dateChanged($event, type) {
    if (dayjs($event.value).isValid()) {
      this.newData = false;
      this.showErrorForGraphs = false;
      this.errorMessage = this.resourceService?.frmelmnts?.lbl?.resourceSelect;
      const year = new Date($event.value._d).getFullYear();
      const month = new Date($event.value._d).getMonth();
      const day = new Date($event.value._d).getDate();
      const eventDateConverted = dayjs(_.get($event, 'value._d')).format('YYYY-MM-DD');
      if(type === 'startDate'){
        if(this.reportForm.controls.endDate.value && ((eventDateConverted) > this.reportForm.controls.endDate.value)){
          this.reportForm.controls.startDate.setErrors({matDatepickerMax:true});
          this.cd.detectChanges();
          return;
        }
        this.minEndDate = new Date(year, month, day + 1);
      }else{
        if(this.reportForm.controls.startDate.value && (eventDateConverted < this.reportForm.controls.startDate.value)){
          this.reportForm.controls.endDate.setErrors({matDatepickerMin:true});
          this.cd.detectChanges();
          return;
        }
        this.maxStartDate = new Date(year, month, day - 1);
      }
      this.reportForm.controls[type].setValue(eventDateConverted);
    }else{
      this.reportForm.controls[type].setErrors({matDatepickerMax:true});
    }
    this.cd.detectChanges();
  }

  closeDashboard(){
    this.location.back()
  }

  dataFilterQuery(filterKeysObj,keys){
    if(this.selectedReport['queryType'] === "cassandra"){
      this.filter = _.cloneDeep(this.selectedReport['filters'])
      _.map(this.filter, filterObj => {
         _.remove(filterObj['table_filters'], filterItem => {
             _.map(keys,key => {
            (filterItem.name === key || filterItem.operator === key) && (filterItem.value = filterKeysObj[key])
          })
          return filterItem.value === undefined
        })
      })
    }else{
        this.selectedReport['filters'].map(data => {
        keys.filter(key => {
          return data.dimension === key && (_.has(data,'value') ? data.value = filterKeysObj[key] : data.values = filterKeysObj[key]);
        })
        if (data.value !== undefined || data.values !== undefined) {
          this.filter.push(data);
        }
      });
    }
  }

  hashTheTag(key:string):string{
    return Md5.hashStr(key);
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}