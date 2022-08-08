import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INoResultMessage, ToasterService, IUserData, IUserProfile, LayoutService, ResourceService, ConfigService, OnDemandReportService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject, Subscription, throwError } from 'rxjs';
import { KendraService, UserService, FormService } from '@sunbird/core';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Location } from '@angular/common';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ReportService } from '../../../dashboard/services';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
const PRE_DEFINED_PARAMETERS = ['$slug', 'hawk-eye'];
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
  @ViewChild('reportElement') reportElement;
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

  reportForm = new FormGroup({
    programName: new FormControl('', [Validators.required]),
    solution: new FormControl('', [Validators.required]),
    reportType: new FormControl('', [Validators.required]),
    districtName: new FormControl(),
    organisationName: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl()
  });

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
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
  lastUpdatedOn: any;
  exportOptions = ['Pdf', 'Img'];
  hideElements: boolean = false;
  globalDistrict: any;
  globalOrg: any;
  tabIndex: number;
  tableToCsv: boolean;
  hideTableToCsv:boolean = true;
  minEndDate: any;  //Min end date - has to be one more than start date 
  maxEndDate: any;  //Max end date -  current date has to be max
  maxStartDate: any; //Start date - has to be one day less than end date

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
    public reportService: ReportService
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

  getDistritAndOrganisationList() {

    const paramOptions = {
      url:
        this.config.urlConFig.URLS.KENDRA.DISTRICTS_AND_ORGANISATIONS + '/' + this.reportForm.controls.solution.value
    };
    this.kendraService.get(paramOptions).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data && Object.keys(data.result).length) {
        this.districts = data.result.districts;
        if (data.result.organisations) {
          data.result.organisations.map(org => {
            if (org?.orgName !== null) {
              this.organisations.push(org)
            }
          });
        }
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
    this.minEndDate = new Date(currentYear - 100, 0, 1);
    this.maxEndDate = new Date(currentYear + 0, currentMonth, today);
    this.maxStartDate = new Date(currentYear + 0, currentMonth, today - 1);
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
    const explicitValue = _.get(this.reportForm, 'controls.solution.value')
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
    const program = this.programs.filter(data => {
      if (data._id == $event.value) {
        return data;
      }
    });
    this.solutions = [];
    this.reportTypes = [];
    this.onDemandReportData = [];
    this.getSolutionList(program[0]);
    this.reportForm.controls.programName.setValue($event.value);
    this.newData = true;
    this.globalDistrict = this.globalOrg = undefined;
  }

  public selectSolution($event) {
    this.newData = false;
    this.noResult = false;
    this.districts = []
    this.organisations = [];
    this.globalDistrict = this.globalOrg = undefined;
    if (this.programSelected && this.reportForm.value && this.reportForm.value['solution']) {
      const solution = this.solutions.filter(data => {
        if (data._id == $event.value) {
          return data;
        }
      });
      this.tag = solution[0]._id + '_' + this.userId;
      this.loadReports();

      const program = this.programSelected;
      this.reportForm.reset();
      this.reportForm.controls.solution.setValue($event.value);
      this.reportForm.controls.programName.setValue(program);

      if (solution[0].isRubricDriven == true && solution[0].type == 'observation') {
        const type = solution[0].type + '_with_rubric';
        this.getReportTypes(this.programSelected, type);
      } else {
        this.getReportTypes(this.programSelected, solution[0].type);
      }
      this.getDistritAndOrganisationList();


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
          (result?.tables[0]?.data != undefined) ? this.hideTableToCsv = true : this.hideTableToCsv = false; 
          result['reportMetaData'] = reportConfig;
          result['lastUpdatedOn'] = this.reportService.getFormattedDate(this.reportService.getLatestLastModifiedOnDate(data));
          this.lastUpdatedOn = moment(_.get(result, 'lastUpdatedOn')).format('DD-MMMM-YYYY');
          this.chartsReportData = JSON.parse(JSON.stringify(result));
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
      tableData.downloadUrl = this.resolveParameterizedPath(_.get(table, 'downloadUrl') || downloadUrl, _.get(this.reportForm, 'controls.solution.value'));
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
    this.convertHTMLToCanvas(this.reportElement.nativeElement, {
      scrollX: 0,
      scrollY: -window.scrollY,
      scale: 2
    }).then(canvas => {
      const imageURL = canvas.toDataURL('image/jpeg');
      const pdf = new jspdf('p', 'px', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();

      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.internal.pageSize.setHeight(imageHeight);
      pdf.addImage(imageURL, 'JPEG', 10, 8, pageWidth - 28, imageHeight - 24);
      pdf.save('report.pdf');
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
    }).catch(err => {
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
    });
  }

  downloadReportAsImage() {
    this.convertHTMLToCanvas(this.reportElement.nativeElement, {
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
    }).catch(err => {
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
    this.globalDistrict = this.globalOrg = undefined;
    this.timeRangeInit();
  }

  loadReports() {
    this.onDemandReportService.getReportList(this.tag).subscribe((data) => {
      if (data) {
        const reportData = _.get(data, 'result.jobs');
        this.onDemandReportData = _.map(reportData, (row) => this.dataModification(row));
      }
    }, error => {
      this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
    });
  }

  districtSelection($event) {
    this.globalDistrict = $event.value
    this.reportForm.controls.districtName.setValue($event.value);
  }

  organisationSelection($event) {
    this.globalOrg = $event.value
    this.reportForm.controls.organisationName.setValue($event.value);
  }

  reportChanged(selectedReportData) {
    this.selectedReport = selectedReportData;
  }
  addFilters() {
    let filterKeysObj = {
      program_id: _.get(this.reportForm, 'controls.programName.value'),
      solution_id: _.get(this.reportForm, 'controls.solution.value'),
      programId: _.get(this.reportForm, 'controls.programName.value'),
      solutionId: _.get(this.reportForm, 'controls.solution.value'),
      district_externalId: _.get(this.reportForm, 'controls.districtName.value') || undefined,
      organisation_id: _.get(this.reportForm, 'controls.organisationName.value') || undefined
    }
    let keys = Object.keys(filterKeysObj);
    this.selectedReport['filters'].map(data => {
      keys.filter(key => {
        return data.dimension == key && (data.value = filterKeysObj[key]);
      })
      if (data.value !== undefined) {
        this.filter.push(data);
      }
    });
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
          ...(_.get(this.reportForm, 'controls.startDate.value') && { 'start_date': _.get(this.reportForm, 'controls.startDate.value') }),
          ...(_.get(this.reportForm, 'controls.endDate.value') && { 'end_date': _.get(this.reportForm, 'controls.endDate.value') }),
          filters: this.filter
        },
        title: this.selectedReport.name
      };
      const request = {
        request: {
          dataset: 'druid-dataset',
          tag: this.tag,
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
      }, 5000);
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
      if (value.datasetConfig.type == this.selectedReport.datasetId && value.datasetConfig.params.solutionId == this.selectedSolution) {
        selectedReportList.push(value);
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

  startDateChanged($event) {
    if (moment($event.value).isValid()) {
      const year = new Date($event.value._d).getFullYear();
      const month = new Date($event.value._d).getMonth();
      const day = new Date($event.value._d).getDate();
      this.minEndDate = new Date(year, month, day + 1);
      this.reportForm.controls.startDate.setValue(moment(_.get($event, 'value._d')).format('YYYY-MM-DD'));
    }
  }

  endDateChanged($event) {
    if (moment($event.value).isValid()) {
      const year = new Date($event.value._d).getFullYear();
      const month = new Date($event.value._d).getMonth();
      const day = new Date($event.value._d).getDate();
      this.maxStartDate = new Date(year, month, day - 1);
      this.reportForm.controls.endDate.setValue(moment(_.get($event, 'value._d')).format('YYYY-MM-DD'));
    }
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
