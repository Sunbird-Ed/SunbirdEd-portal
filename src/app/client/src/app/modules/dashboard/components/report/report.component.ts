import { TelemetryService } from '@sunbird/telemetry';
import { UserService, TncService } from '@sunbird/core';
import { INoResultMessage, ResourceService, ToasterService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChildren, QueryList, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReportService } from '../../services';
import * as _ from 'lodash-es';
import { Observable, throwError, of, forkJoin, Subject, merge, combineLatest } from 'rxjs';
import { mergeMap, switchMap, map, retry, catchError, tap, pluck, first } from 'rxjs/operators';
import { DataChartComponent } from '../data-chart/data-chart.component';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { ISummaryObject } from '../../interfaces';
import { Location } from '@angular/common';

enum ReportType {
  report,
  dataset
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  public report: any;
  public showSummaryModal = false;
  public report$;
  public noResultMessage: INoResultMessage;
  public noResult: boolean;
  private downloadUrl: string;
  public reportObj: any;
  public isUserReportAdmin = false;
  @ViewChildren(DataChartComponent) chartsComponentList: QueryList<DataChartComponent>;
  @ViewChild('reportElement') reportElement;
  public hideElements: boolean;
  public reportExportInProgress = false;
  public exportOptions = ['Pdf', 'Img'];
  public inputForSummaryModal: any;
  private _reportSummary: string;
  private addSummaryBtnClickStream$ = new Subject<ISummaryObject>();
  private publishBtnStream$ = new Subject();
  private retireBtnStream$ = new Subject();
  public markdownUpdated$ = new Subject();
  public currentReportSummary: any;
  public showComponent = true;
  public showConfirmationModal = false;
  public confirmationPopupInput: { title: string, event: 'retire' | 'publish', body: string };
  private materializedReport = false;
  private hash: string;
  public getParametersValueForDropDown$: Observable<any>;
  public type: ReportType = ReportType.report;
  private reportConfig: object;
  layoutConfiguration: any;
  public selectedFilters: Object;
  public showChart = true;
  public reportData: any;
  public chartsReportData: any;
  public globalFilterChange: Object;
  public resetFilters: Object;
  filterType = 'report-filter';
  public reportResult: any;
  public showExportsOption = true;
  private set setMaterializedReportStatus(val: string) {
    this.materializedReport = (val === 'true');
  }
  userProfile;
  reportViewerTncVersion: string;
  reportViewerTncUrl: string;
  showTncPopup = false;
  showResetFilter = true;

  private set setParametersHash(report) {
    const { hash } = this.activatedRoute.snapshot.params;
    this.hash = hash;
    if (this.reportService.isReportParameterized(report) && !this.reportService.isUserSuperAdmin()) {
      this.hash = _.get(report, 'hashed_val') || this.reportService.getParametersHash(this.report);
    }
  }

  constructor(public reportService: ReportService, private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService, private toasterService: ToasterService,
    private navigationhelperService: NavigationHelperService,
    private router: Router, private telemetryService: TelemetryService, private layoutService: LayoutService,
    private cdr: ChangeDetectorRef, private userService: UserService, public tncService: TncService,
    public location:Location
  ) { }


  ngOnInit() {
    this.initLayout();
    this.userService.userData$.pipe(first()).subscribe(async (user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        this.getReportViewerTncPolicy();
      }
    });
    this.report$ = combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      switchMap(params => {
        const { reportId, hash } = this.activatedRoute.snapshot.params;
        this.setMaterializedReportStatus = this.activatedRoute.snapshot.queryParams.materialize;
        return this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
          mergeMap((isAuthenticated: boolean) => {
            this.noResult = false;
            this.hideElements = false;
            return isAuthenticated ? this.renderReport(reportId, hash) : throwError({ messageText: 'messages.stmsg.m0144' });
          }),
          catchError(err => {
            console.error('Error while rendering report', err);
            this.noResultMessage = {
              'messageText': _.get(err, 'messageText') || 'messages.stmsg.m0131'
            };
            this.noResult = true;
            return of({});
          })
        );

      })
    );

    this.mergeClickEventStreams();
  }

  /**
   * @description fetches a report by its report id
   * @param reportId
   */
  private fetchConfig(reportId, hash?: string): Observable<any> {
    if (this.materializedReport) { hash = null; }
    return this.reportService.fetchReportById(reportId, hash).pipe(
      mergeMap(apiResponse => {
        const report = _.get(apiResponse, 'reports');
        return report ? of(_.head(report)) : throwError('No report found');
      })
    );
  }

  /**
   * @description This function fetches config file, datasource and prepares chart and tables data from it.
   * @param reportId
   */
  private renderReport(reportId: string, hash?: string) {
    return this.fetchConfig(reportId, hash)
      .pipe(
        switchMap(report => {
          const isUserReportAdmin = this.isUserReportAdmin = this.reportService.isUserReportAdmin();
          if (!isUserReportAdmin && _.toLower(_.get(report, 'status')) !== 'live') {
            return throwError({ messageText: 'messages.stmsg.m0144' });
          } else {
            this.report = report;
            this.type = _.get(report, 'report_type') === 'report' ? ReportType.report : ReportType.dataset;
            if (this.reportService.isReportParameterized(report) && _.get(report, 'children.length') &&
              !this.reportService.isUserSuperAdmin()) {
              return throwError({ messageText: 'messages.emsg.mutliParametersFound' });
            }
            this.setParametersHash = this.report;
            this.getParametersValueForDropDown$ = this.getParametersValueForDropDown(report);
            if (this.materializedReport) {
              this.report.status = 'draft';
            }
            const reportConfig = this.reportConfig = _.get(report, 'reportconfig');
            this.setDownloadUrl(_.get(reportConfig, 'downloadUrl'));
            const dataSource = _.get(reportConfig, 'dataSource') || [];
            let updatedDataSource = _.isArray(dataSource) ? dataSource : [{ id: 'default', path: dataSource }];
            updatedDataSource = this.reportService.getUpdatedParameterizedPath(updatedDataSource, this.hash);
            const charts = _.get(reportConfig, 'charts'), tables = _.get(reportConfig, 'table'), files = _.get(reportConfig, 'files');
            return forkJoin(this.reportService.downloadMultipleDataSources(updatedDataSource), this.getLatestSummary(reportId)).pipe(
              retry(1),
              map((apiResponse) => {
                const [data, reportSummary] = apiResponse;
                const result: any = Object.assign({});
                const chart = (charts && this.reportService.prepareChartData(charts, data, updatedDataSource,
                  _.get(reportConfig, 'reportLevelDataSourceId'))) || [];
                result['charts'] = chart;
                result['tables'] = (tables && this.reportService.prepareTableData(tables, data, _.get(reportConfig, 'downloadUrl'),
                  this.hash)) || [];
                result['reportMetaData'] = reportConfig;
                result['reportSummary'] = reportSummary;
                result['files'] = this.reportService.getParameterizedFiles(files || [], this.hash);
                result['lastUpdatedOn'] = this.reportService.getFormattedDate(this.reportService.getLatestLastModifiedOnDate(data));
                this.chartsReportData = JSON.parse(JSON.stringify(result));
                this.reportData = JSON.parse(JSON.stringify(result));
                return result;
              })
            );
          }
        })
      );
  }

  /**
   * @description Downloads csv file from azure blob storage
   * @param downloadUrl
   */
  public downloadCSV(downloadUrl?: string) {
    this.reportService.downloadReport(downloadUrl || this.downloadUrl).subscribe(
      result => {
        window.open(result, '_blank');
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0076);
      }
    );
  }
  /**
   * @description sets downloadUrl for active tab
   * @param url
   */
  public setDownloadUrl(url) {
    this.downloadUrl = this.reportService.resolveParameterizedPath(url, this.hash ?
      this.reportService.getParameterFromHash(this.hash) : null);
  }

  public getTelemetryInteractEdata = ({ id = 'report-chart', type = 'click', pageid = this.activatedRoute.snapshot.data.telemetry.pageid,
    subtype = null }) => ({ id, type, pageid, ...subtype && { subtype } })

  public setTelemetryInteractObject(val?: string) {
    return {
      id: val || this.activatedRoute.snapshot.params.reportId,
      type: 'Report',
      ver: '1.0'
    };
  }

  public setTelemetryInteractEdata(val) {
    return {
      id: val,
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }

  downloadReport(reportType) {
    this.reportExportInProgress = true;
    this.toggleHtmlVisibilty(true);
    setTimeout(() => {
      switch (_.toLower( _.get(reportType, 'value'))) {
        case 'img': {
          this.downloadReportAsImage();
          break;
        }
        case 'pdf': {
          this.downloadReportAsPdf();
          break;
        }
      }
      const telemetryObj = this.getTelemetryImpressionObj({ type: 'export-request', subtype: _.toLower( _.get(reportType, 'value')) });
      this.telemetryService.impression(telemetryObj);
    }, 1500);
  }


  private convertHTMLToCanvas(element, options) {
    return html2canvas(element, options);
  }

  private downloadReportAsPdf() {

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

  private downloadReportAsImage() {

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

  public openAddSummaryModal({ type, title, index = null, chartId = null,
    summary = null }: ISummaryObject): void {
    this.showSummaryModal = true;
    this.inputForSummaryModal = { title, type, index, chartId, summary };
  }

  public openReportSummaryModal(): void {
    this.openAddSummaryModal({
      title: (this.currentReportSummary != '' ? 'Update ' : 'Add ') + _.get(this.resourceService, 'frmelmnts.lbl.reportSummary'),
      type: 'report',
      ...(this._reportSummary && { summary: this._reportSummary })
    });
  }

  private getLatestSummary(reportId: string) {
    const hash = this.hash;
    return this.reportService.getLatestSummary({ reportId, hash }).pipe(
      map(reportSummary => {
        this._reportSummary = '';
        const summaries = this.currentReportSummary = _.map(reportSummary, summaryObj => {
          const summary = _.get(summaryObj, 'summary');
          this._reportSummary = summary;

          return {
            label: (this.currentReportSummary != '' ? 'Update ' : 'Add ') + _.get(this.resourceService, 'frmelmnts.lbl.reportSummary'),
            text: [summary],
            createdOn: _.get(summaryObj, 'createdon')
          };
        });
        return summaries;
      })
    );
  }

  public closeSummaryModal(): void {
    this.showSummaryModal = false;
  }

  public onAddSummary(event: ISummaryObject) {
    this.addSummaryBtnClickStream$.next(event);
  }

  public openConfirmationModal(eventType: 'publish' | 'retire') {
    const { confirmReportPublish, confirmRetirePublish } = _.get(this.resourceService, 'messages.imsg');
    this.confirmationPopupInput = {
      title: 'Confirm',
      body: eventType === 'publish' ? confirmReportPublish : confirmRetirePublish,
      event: eventType
    };
    this.showConfirmationModal = true;
  }

  private closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  public handleConfirmationEvent(event: boolean) {
    this.closeConfirmationModal();
    if (event) {
      switch (this.confirmationPopupInput.event) {
        case 'publish': {
          this.onPublish(event);
          break;
        }
        case 'retire': {
          this.onRetire(event);
          break;
        }
      }
    }
  }

  public onPublish(event) {
    this.publishBtnStream$.next(event);
  }

  public onRetire(event): void {
    this.retireBtnStream$.next(event);
  }

  private mergeClickEventStreams() {
    merge(this.handleAddSummaryStreams(), this.handlePublishBtnStream(), this.handleRetireBtnStream(),
      this.handleUpdatedMarkdown())
      .subscribe(res => {
        this.refreshComponent();
      }, err => {
        console.log({ err });
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
  }

  /**
  * @description handles click stream from add report and chart summary button
  * @private
  * @returns
  * @memberof ReportComponent
  */
  private handleAddSummaryStreams() {
    return this.addSummaryBtnClickStream$.pipe(
      mergeMap(event => {
        const { reportId } = this.activatedRoute.snapshot.params;
        event['hash'] = this.hash;
        this.closeSummaryModal();
        const cdata = [...(event['chartId'] ? [this.getCDataObj({ id: event['chartId'], type: 'Chart' })] : [])];
        this.logTelemetry({ type: 'select-submit', cdata, subtype: _.get(event, 'type') });
        return this.reportService.addReportSummary({
          reportId,
          summaryDetails: event
        });
      }),
      tap(res => {
        this.toasterService.info(this.resourceService.messages.imsg.reportSummaryAdded);
      })
    );
  }
  /**
   * @description refreshes the component to show updated data
   * @private
   * @memberof ReportComponent
   */
  private refreshComponent() {
    this.showComponent = false;
    setTimeout(() => {
      this.showComponent = true;
    });
  }

  /**
   * @description handles click stream from publish button
   * @private
   * @returns
   * @memberof ReportComponent
   */
  private handlePublishBtnStream() {
    return this.publishBtnStream$.pipe(
      switchMap(event => {
        const { reportId } = this.activatedRoute.snapshot.params;
        const hash = this.hash;
        return this.reportService.publishReport(reportId, hash);
      }),
      tap(res => {
        this.toasterService.info(this.resourceService.messages.imsg.reportPublished);
        this.report.status = 'live';
        if (this.materializedReport) {
          this.materializedReport = false;
          this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: {} });
        }
      })
    );
  }

  private handleRetireBtnStream() {
    return this.retireBtnStream$.pipe(
      switchMap(event => {
        const { reportId } = this.activatedRoute.snapshot.params;
        const hash = this.hash;
        return this.reportService.retireReport(reportId, hash);
      }),
      tap(res => {
        this.toasterService.info(this.resourceService.messages.imsg.reportRetired);
        this.report.status = 'retired';
        if (this.materializedReport) {
          this.materializedReport = false;
          this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: {} });
        }
      })
    );
  }

  public gotoListPage() {
    this.location.back();
  }

  public getParametersValueForDropDown(report?: object) {
    const { reportId } = this.activatedRoute.snapshot.params;
    return this.reportService.fetchReportById(reportId).pipe(
      pluck('reports'),
      switchMap(reports => {
        if (this.reportService.isUserSuperAdmin()) {
          return this.reportService.getMaterializedChildRows(reports).pipe(
            map((response: any[]) => {
              const [reportObj] = response;
              return _.get(reportObj, 'children');
            })
          );
        } else {
          return of(_.map(_.get(reports[0], 'children') || [],
            child => ({ ...child, label: this.reportService.getParameterFromHash(child.hashed_val) })));
        }
      })
    );
  }

  public handleParameterChange(val) {
    const { reportId } = this.activatedRoute.snapshot.params;
    const { hashed_val, materialize = false } = _.get(val, 'value');
    this.router.navigate(['/dashBoard/reports', reportId, hashed_val], { queryParams: { ...materialize && { materialize } } }).then(() => {
      this.refreshComponent();
    });
  }

  public getCDataObj = ({ id, type }) => ({ id, type });

  private logTelemetry({ type, cdata = [], subtype = null }) {
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'reports',
        cdata: [...cdata, { id: _.get(this.reportService.getParameterValues('$slug'), 'value'), type: 'State' }]
      },
      edata: {
        ...this.getTelemetryInteractEdata({ type, subtype }),
      },
      object: {
        ...this.setTelemetryInteractObject(),
        rollup: {}
      }
    };
    this.telemetryService.interact(interactData);
  }

  public getTelemetryImpressionObj = ({ type, subtype = null }) => ({
    context: {
      env: this.activatedRoute.snapshot.data.telemetry.env
    },
    object: {
      id: this.activatedRoute.snapshot.params.reportId,
      type: 'Report',
      ver: '1.0'
    },
    edata: {
      type: type || this.activatedRoute.snapshot.data.telemetry.type,
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
      uri: this.router.url,
      duration: this.navigationhelperService.getPageLoadTime(),
      ...(subtype && { subtype })
    }
  })

  private handleUpdatedMarkdown() {
    return this.markdownUpdated$.pipe(
      switchMap((event: { data: string, type: string }) => {
        const updatedReportConfig = {
          ...this.reportConfig,
          dataset: {
            ...this.reportConfig['dataset'],
            [event.type]: btoa(event.data)
          }
        };

        const { reportId } = this.activatedRoute.snapshot.params;
        return this.reportService.updateReport(reportId, {
          reportconfig: updatedReportConfig
        });
      })
    );
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout()
      .subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
  }

  getAllChartData() {
    const chartData = [];
    if (this.reportData.charts) {
      this.reportData.charts.map(chartInfo => {
        chartData.push({ id: chartInfo.chartConfig.id, data: chartInfo.chartData });
      });
    }
    return chartData;
  }

  getChartData(chart) {
    const chartInfo = this.chartsReportData.charts.find(data => {
      if (data['chartConfig']['id'] == chart['chartConfig']['id']) {
        return true;
      }
    });
    return chartInfo;
  }
  public filterChanged(data: any): void {
    if (this.chartsReportData && this.chartsReportData.charts) {
      this.chartsReportData.charts.map(element => {
        data.chartData.forEach(chart => {
          if (chart['id'] === element['chartConfig']['id']) {
            element.chartData = chart.data;
          }
        });
        return element;
      });
    }
    this.globalFilterChange = {
      chartData: data.chartData,
      filters: data.filters
    };
    this.cdr.detectChanges();
  }

  resetFilter() {
    this.resetFilters = { data: this.getAllChartData(), reset: true };
  }

  selectedTabChange(event) {

    const { type, downloadURL } = _.get(event, 'tab.textLabel');
    this.showExportsOption = ['chart', 'download'].includes(type);
    this.showResetFilter = ['chart'].includes(type);

    downloadURL && this.setDownloadUrl(downloadURL);
  }
  getReportViewerTncPolicy() {
    this.tncService.getReportViewerTnc().subscribe((data) => {
      const reportViewerTncData = JSON.parse(_.get(data, 'result.response.value'));
      if (_.get(reportViewerTncData, 'latestVersion')) {
        this.reportViewerTncVersion = _.get(reportViewerTncData, 'latestVersion');
        this.reportViewerTncUrl = _.get(_.get(reportViewerTncData, _.get(reportViewerTncData, 'latestVersion')), 'url');
        this.showReportViewerTncForFirstUser();
      }
  });
}

  showReportViewerTncForFirstUser() {
     const reportViewerTncObj = _.get(this.userProfile, 'allTncAccepted.reportViewerTnc');
     if (!reportViewerTncObj) {
     this.showTncPopup = true;
     }
  }
}

