import { IImpressionEventInput } from '@sunbird/telemetry';
import { INoResultMessage, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { ReportService } from '../../services';
import * as _ from 'lodash-es';
import { Observable, throwError, of, forkJoin, Subject, merge, concat } from 'rxjs';
import { mergeMap, switchMap, map, retry, catchError, tap } from 'rxjs/operators';
import { DataChartComponent } from '../data-chart/data-chart.component';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { ISummaryObject } from '../../interfaces';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit {

  public report: any;
  public showSummaryModal = false;
  public report$;
  public noResultMessage: INoResultMessage;
  public noResult: boolean;
  private downloadUrl: string;
  public reportObj: any;
  public isUserReportAdmin = false;
  telemetryImpression: IImpressionEventInput;
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
  public currentReportSummary: any;
  public showComponent = true;
  public showConfirmationModal = false;
  public confirmationPopupInput: { title: string, event: 'retire' | 'publish', body: string };
  private materializedReport: boolean = false;
  private hash: string;
  private set setMaterializedReportStatus(val: string) {
    this.materializedReport = (val === "true");
  };

  private set setParametersHash(report) {
    const { hash } = this.activatedRoute.snapshot.params;
    this.hash = hash;
    if (this.reportService.isReportParameterized(report) && !this.reportService.isUserSuperAdmin()) {
      this.hash = _.get(report, 'hashed_val') || this.reportService.getParametersHash(this.report);
    }
  }

  constructor(private reportService: ReportService, private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService, private toasterService: ToasterService,
    private navigationhelperService: NavigationHelperService,
    private router: Router) { }

  ngOnInit() {
    const { reportId, hash } = this.activatedRoute.snapshot.params;
    this.setMaterializedReportStatus = this.activatedRoute.snapshot.queryParams.materialize;
    this.report$ = this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
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
    this.mergeClickEventStreams();
  }

  /**
   * @description fetches a report by its report id
   * @param reportId
   */
  private fetchConfig(reportId, hash?: string): Observable<any> {
    if (this.materializedReport) hash = null;
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
            if (this.reportService.isReportParameterized(report) && _.get(report, 'children.length') && !this.reportService.isUserSuperAdmin()) {
              return throwError({ messageText: 'messages.emsg.mutliParametersFound' })
            }
            this.setParametersHash = this.report;
            if (this.materializedReport) {
              this.report.status = "draft";
            }
            const reportConfig = _.get(report, 'reportconfig');
            this.setDownloadUrl(_.get(reportConfig, 'downloadUrl'));
            const dataSource = _.get(reportConfig, 'dataSource') || [];
            let updatedDataSource = _.isArray(dataSource) ? dataSource : [{ id: 'default', path: dataSource }];
            updatedDataSource = this.reportService.getUpdatedParameterizedPath(updatedDataSource, hash);
            const charts = _.get(reportConfig, 'charts'), tables = _.get(reportConfig, 'table'), files = _.get(reportConfig, 'files');
            return forkJoin(this.reportService.downloadMultipleDataSources(updatedDataSource), this.getLatestSummary(reportId)).pipe(
              retry(1),
              map((apiResponse) => {
                const [data, reportSummary] = apiResponse;
                const result: any = Object.assign({});
                result['charts'] = (charts && this.reportService.prepareChartData(charts, data, updatedDataSource,
                  _.get(reportConfig, 'reportLevelDataSourceId'))) || [];
                result['tables'] = (tables && this.reportService.prepareTableData(tables, data, _.get(reportConfig, 'downloadUrl'),
                  _.get(reportConfig, 'reportLevelDataSourceId'))) || [];
                result['reportMetaData'] = reportConfig;
                result['reportSummary'] = reportSummary;
                result['files'] = files || [];
                result['lastUpdatedOn'] = this.reportService.getFormattedDate(this.reportService.getLatestLastModifiedOnDate(data));
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
    this.downloadUrl = url;
  }

  public setTelemetryInteractObject(val) {
    return {
      id: val,
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: {
          id: this.activatedRoute.snapshot.params.reportId,
          type: 'Report',
          ver: '1.0'
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  downloadReport(reportType: string) {
    this.reportExportInProgress = true;
    this.toggleHtmlVisibilty(true);
    setTimeout(() => {
      switch (_.toLower(reportType)) {
        case 'img': {
          this.downloadReportAsImage();
          break;
        }
        case 'pdf': {
          this.downloadReportAsPdf();
          break;
        }
      }
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
      pdf.addImage(imageURL, 'JPEG', 10, 8, pageWidth - 24, imageHeight - 24);
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
      title: `Add ${_.get(this.resourceService, 'frmelmnts.lbl.reportSummary')}`,
      type: 'report',
      ...(this._reportSummary && { summary: this._reportSummary })
    });
  }

  private getLatestSummary(reportId: string) {
    const hash = this.hash;
    return this.reportService.getLatestSummary({ reportId, hash }).pipe(
      map(reportSummary => {
        const summaries = this.currentReportSummary = _.map(reportSummary, summaryObj => {
          const summary = _.get(summaryObj, 'summary');
          this._reportSummary = summary;
          return {
            label: _.get(this.resourceService, 'frmelmnts.lbl.reportSummary'),
            text: [summary]
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
      title: "Confirm",
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
    merge(this.handleAddSummaryStreams(), this.handlePublishBtnStream(), this.handleRetireBtnStream())
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
    )
  }
}


