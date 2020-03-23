import { IImpressionEventInput } from '@sunbird/telemetry';
import { INoResultMessage, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { Component, OnInit, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { ReportService } from '../../services';
import * as _ from 'lodash-es';
import { Observable, throwError, of, forkJoin } from 'rxjs';
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
  telemetryImpression: IImpressionEventInput;
  @ViewChildren(DataChartComponent) chartsComponentList: QueryList<DataChartComponent>;
  @ViewChild('reportElement') reportElement;
  public hideElements: boolean;
  public reportExportInProgress = false;

  constructor(private reportService: ReportService, private userService: UserService, private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService, private toasterService: ToasterService,
    private navigationhelperService: NavigationHelperService,
    private router: Router) { }

  ngOnInit() {
    this.report$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        this.noResult = false;
        this.hideElements = false;
        return this.renderReport(_.get(params, 'reportId')).pipe(
          catchError(err => {
            console.error('Error while rendering report', err);
            this.noResultMessage = {
              'messageText': 'messages.stmsg.m0131'
            };
            this.noResult = true;
            return of({});
          })
        );
      })
    );
  }

  /**
   * @description fetches config file . If no file is found throws an error
   * @param reportId
   */
  private fetchConfig(reportId): Observable<any> {
    const reportsLocationHtmlElement = (<HTMLInputElement>document.getElementById('reportsLocation'));
    const reportsLocation = reportsLocationHtmlElement ? _.get(reportsLocationHtmlElement, 'value') : 'reports';
    const slug = _.get(this.userService, 'userProfile.rootOrg.slug');
    return this.reportService.fetchDataSource(`/${reportsLocation}/${slug}/config.json`).pipe(
      mergeMap(config => {
        const report = _.find(config, ['id', reportId]);
        return report ? of(report) : throwError('No config found');
      })
    );
  }

  /**
   * @description This function fetches config file, datasource and prepares chart and tables data from it.
   * @param reportId
   */
  private renderReport(reportId) {
    return this.fetchConfig(reportId).pipe(
      switchMap(report => {
        this.report = report;
        this.setDownloadUrl(_.get(report, 'downloadUrl'));
        return this.reportService.fetchDataSource(_.get(report, 'dataSource')).pipe(
          retry(1),
          map(data => {
            const charts = _.get(report, 'charts'), tables = _.get(report, 'table');
            const result: any = {};
            result['charts'] = (charts && this.reportService.prepareChartData(charts, data, _.get(report, 'dataSource'))) || [];
            result['tables'] = (tables && this.reportService.prepareTableData(tables, data, _.get(report, 'downloadUrl'))) || [];
            result['reportMetaData'] = report;
            return result;
          })
        );
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
          id: this.userService.userid,
          type: 'user',
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
          this.downloadReportAsPdf();
          break;
        }
      }
    }, 1500);
  }

  private downloadReportAsImage() {
    html2canvas(this.reportElement.nativeElement, {
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
        if (index === 0) {
          reportBody.innerHTML = '';
          element.appendTo(reportBody);
        } else {
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


