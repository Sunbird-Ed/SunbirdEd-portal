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
  public currentReportSummary: any;
  public showComponent = true;

  constructor(private reportService: ReportService, private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService, private toasterService: ToasterService,
    private navigationhelperService: NavigationHelperService,
    private router: Router) { }

  ngOnInit() {
    const reportId: string = this.activatedRoute.snapshot.params.reportId;
    this.report$ = this.reportService.isAuthenticated(_.get(this.activatedRoute, 'snapshot.data.roles')).pipe(
      mergeMap((isAuthenticated: boolean) => {
        this.noResult = false;
        this.hideElements = false;
        return isAuthenticated ? this.renderReport(reportId) : throwError({ messageText: 'messages.stmsg.m0144' });
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
  private fetchConfig(reportId): Observable<any> {
    return this.reportService.fetchReportById(reportId).pipe(
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
  private renderReport(reportId: string) {
    return this.fetchConfig(reportId)
      .pipe(
        switchMap(report => {
          const isUserReportAdmin = this.isUserReportAdmin = this.reportService.isUserReportAdmin();
          if (!isUserReportAdmin && _.toLower(_.get(report, 'status')) !== 'live') {
            return throwError({ messageText: 'messages.stmsg.m0144' });
          } else {
            this.report = report;
            const reportConfig = _.get(report, 'reportconfig');
            this.setDownloadUrl(_.get(reportConfig, 'downloadUrl'));
            const dataSource = _.get(reportConfig, 'dataSource');
            const updatedDataSource = _.isArray(dataSource) ? dataSource : [{ id: 'default', path: dataSource }];
            const charts = _.get(reportConfig, 'charts'), tables = _.get(reportConfig, 'table');

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
    this.reportService.downloadReport(this.downloadUrl).subscribe(
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
      scrollY: -window.scrollY
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
      scrollY: -window.scrollY
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
      title: 'Add Report Summary',
      type: 'report',
      ...(this._reportSummary && { summary: this._reportSummary })
    });
  }

  private getLatestSummary(reportId: string) {
    return this.reportService.getLatestSummary({ reportId }).pipe(
      map(reportSummary => {
        const summaries = this.currentReportSummary = _.map(reportSummary, summaryObj => {
          const summary = _.get(summaryObj, 'summary');
          this._reportSummary = summary;
          return {
            label: 'Report Summary',
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

  public onPublish(event) {
    this.publishBtnStream$.next(event);
  }

  private mergeClickEventStreams() {
    merge(this.handleAddSummaryStreams(), this.handlePublishBtnStream())
      .subscribe(res => {
        this.refreshComponent();
      }, err => {
        this.toasterService.error('Something went wrong. Please try again later');
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
        const reportId: string = this.activatedRoute.snapshot.params.reportId;
        this.closeSummaryModal();
        return this.reportService.addReportSummary({
          reportId,
          summaryDetails: event
        });
      }),
      tap(res => {
        this.toasterService.info('Comment added successfully');
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
        return this.reportService.publishReport(this.activatedRoute.snapshot.params.reportId);
      }),
      tap(res => {
        this.toasterService.info('Report Published Successfully');
        this.report.status = 'live';
      })
    );
  }
}


