import { IImpressionEventInput } from '@sunbird/telemetry';
import { INoResultMessage, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { ReportService } from '../../services';
import * as _ from 'lodash-es';
import { Observable, throwError, of, forkJoin, combineLatest } from 'rxjs';
import { mergeMap, switchMap, map, retry, catchError, tap } from 'rxjs/operators';
import { DataChartComponent } from '../data-chart/data-chart.component';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit {

  public report: any;
  public report$;
  public noResultMessage: INoResultMessage;
  public noResult: boolean;
  private downloadUrl: string;
  public reportObj: any;
  telemetryImpression: IImpressionEventInput;
  @ViewChildren(DataChartComponent) chartsComponentList: QueryList<DataChartComponent>;
  @ViewChild('reportElement') reportElement;
  public hideElements: boolean;
  public reportExportInProgress = false;

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
    return this.fetchConfig(reportId).pipe(
      switchMap(report => {
        const isUserReportAdmin = this.reportService.isUserReportAdmin();
        if (!isUserReportAdmin && _.toLower(_.get(report, 'status')) !== 'live') {
          return throwError({ messageText: 'messages.stmsg.m0144' });
        } else {
          this.report = report;
          const reportConfig = _.get(report, 'reportconfig');
          this.setDownloadUrl(_.get(reportConfig, 'downloadUrl'));
          return this.reportService.fetchDataSource(_.get(reportConfig, 'dataSource')).pipe(
            retry(1),
            map(data => {
              const charts = _.get(reportConfig, 'charts'), tables = _.get(reportConfig, 'table');
              const result: any = {};
              result['charts'] = (charts && this.reportService.prepareChartData(charts, data, _.get(reportConfig, 'dataSource'))) || [];
              result['tables'] = (tables && this.reportService.prepareTableData(tables, data, _.get(reportConfig, 'downloadUrl'))) || [];
              result['reportMetaData'] = reportConfig;
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

  downloadReport(reportType) {
    this.reportExportInProgress = true;
    this.toggleHtmlVisibilty(true);
    setTimeout(() => {
      switch (_.toLower(reportType)) {
        case 'img': {
          this.downloadReportAsImage();
          break;
        }
        case 'pdf': {
          this.convertToPdf();
          break;
        }
      }
    }, 1500);
  }


  private convertHTMLToCanvas(element, options) {
    return html2canvas(element, options);
  }

  private convertToPdf() {
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

  private getCanvasElement(element, index): Promise<any> {
    return html2canvas(this.reportElement.nativeElement, {
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: documentObject => {
        const reportHeader = documentObject.querySelector('#report-header');
        const reportBody = documentObject.querySelector('#report-body');
        const reportSummary = documentObject.querySelector('#report-summary');
        if (index === 0) {
          reportBody.innerHTML = '';
          element.appendTo(reportBody);
        } else {
          reportSummary.innerHTML = '';
          reportHeader.innerHTML = '';
          reportBody.innerHTML = '';
          element.appendTo(reportBody);
        }
      }
    }).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg');
      const position = 8;
      return { contentDataURL, position, canvas };
    });
  }

  private downloadReportAsPdf() {
    const pdf = new jspdf('p', 'px', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const addPage = (imageUrl, imageType, position, width, height, index) => {
      if (index !== 0) {
        pdf.addPage();
      }
      pdf.addImage(imageUrl, imageType, 10, position, width - 24, height - 24);
      return pdf;
    };
    const chartElements = this.getChartComponents();
    of(chartElements).pipe(
      switchMap(elements => forkJoin(_.map(elements, (element, index) => {
        const clonedElement = $(element.rootElement).first().clone(true);
        if (_.get(element, 'canvas')) {
          const origCanvas = $(element.rootElement).first().find('canvas');
          const clonedCanvas = clonedElement.find('canvas');
          clonedCanvas.prop('id', UUID.UUID());
          clonedCanvas[0].getContext('2d').drawImage(origCanvas[0], 0, 0);
        }
        return this.getCanvasElement(clonedElement, index);
      })).pipe(
        tap(canvasElements => {
          _.forEach(canvasElements, (canvasDetails, index) => {
            const imageHeight = (canvasDetails.canvas.height * pageWidth) / canvasDetails.canvas.width;
            addPage(canvasDetails.contentDataURL, 'JPEG', canvasDetails.position, pageWidth, imageHeight, index);
          });
        })
      ))
    ).subscribe(response => {
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
      pdf.save('report.pdf');
    }, err => {
      this.toggleHtmlVisibilty(false);
      this.reportExportInProgress = false;
      console.log('Error while generation report Pdf', err);
    });
  }

  // hides elements which are not required for printing reports to pdf or image.
  private toggleHtmlVisibilty(flag: boolean) {
    this.hideElements = flag;
  }

  // gets the list of the all chart elements inside reports
  private getChartComponents(): Array<HTMLElement> {
    const chartComponentArray = this.chartsComponentList.length && this.chartsComponentList.toArray();
    const result = _.map(chartComponentArray, chartComponent => {
      if (!chartComponent) { return null; }
      return {
        rootElement: _.get(chartComponent, 'chartRootElement.nativeElement'),
        canvas: _.get(chartComponent, 'chartCanvas.nativeElement')
      };
    });
    return _.compact(result);
  }

}


