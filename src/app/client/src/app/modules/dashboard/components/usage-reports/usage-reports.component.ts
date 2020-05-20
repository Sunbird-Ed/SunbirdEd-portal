import { IInteractEventEdata, IInteractEventObject, TelemetryInteractDirective, IImpressionEventInput } from '@sunbird/telemetry';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UsageService } from './../../services';
import * as _ from 'lodash-es';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '@sunbird/core';
import { ToasterService, ResourceService, INoResultMessage, NavigationHelperService } from '@sunbird/shared';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-usage-reports',
  templateUrl: './usage-reports.component.html',
  styleUrls: ['./usage-reports.component.scss']
})
export class UsageReportsComponent implements OnInit, AfterViewInit {
  reportMetaData: any;
  chartData: Array<object> = [];
  tables: any;
  files: any;
  isTableDataLoaded = false;
  isFileDataLoaded = false;
  currentReport: any;
  slug: string;
  noResult: boolean;
  showLoader = false;
  noResultMessage: INoResultMessage;
  private activatedRoute: ActivatedRoute;
  telemetryImpression: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractDownloadEdata: IInteractEventEdata;
  downloadUrl;
  @ViewChild(TelemetryInteractDirective) telemetryInteractDirective;
  constructor(private usageService: UsageService, private sanitizer: DomSanitizer,
    public userService: UserService, private toasterService: ToasterService,
    public resourceService: ResourceService, activatedRoute: ActivatedRoute, private router: Router,
    public navigationhelperService: NavigationHelperService
  ) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
    const reportsLocation = (<HTMLInputElement>document.getElementById('reportsLocation')).value;
    this.slug = _.get(this.userService, 'userProfile.rootOrg.slug');
    this.usageService.getData(`/${reportsLocation}/${this.slug}/config.json`)
      .subscribe(data => {
        if (_.get(data, 'responseCode') === 'OK') {
          this.noResult = false;
          this.reportMetaData = _.get(data, 'result');
          if (this.reportMetaData[0]) { this.renderReport(this.reportMetaData[0]); }
        }
      }, (err) => {
        console.log(err);
        this.noResultMessage = {
          'messageText': 'messages.stmsg.m0131'
        };
        this.noResult = true;
      });
  }

  setTelemetryInteractObject(val) {
    return {
      id: val,
      type: 'Report',
      ver: '1.0'
    };
  }

  setTelemetryInteractEdata(val) {
    return {
      id: val,
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  renderReport(report: any) {
    this.chartData = [];
    this.tables = [];
    this.files = [];
    this.currentReport = report;
    this.isTableDataLoaded = false;
    const url = report.dataSource;
    this.showLoader = true;
    this.downloadUrl = report.downloadUrl;
    this.usageService.getData(url)
      .subscribe((response) => {
        if (_.get(response, 'responseCode') === 'OK') {
          const data = _.get(response, 'result');
          this.showLoader = false;
          if (_.get(report, 'charts')) {
            this.createChartData(_.get(report, 'charts'), data, url);
          }
          if (_.get(report, 'table')) {
            this.renderTable(_.get(report, 'table'), data);
          } else {
            this.renderTable({}, data);
          }
          if (_.get(report, 'files')) {
            this.renderFiles(_.get(report, 'files'), data);
          } else {
            this.renderFiles({}, data);
          }
        } else {
          console.log(response);
        }

      }, err => { console.log(err); });
  }

  renderFiles(files, data) {
    this.files = [];
    _.forEach(files, file =>  {
      const fileData: any = {};
      fileData.id = _.get(file, 'id');
      fileData.name = _.get(file, 'name');
      fileData.desc = _.get(file, 'description');
      fileData.size = _.get(file, 'fileSize');
      fileData.createdOn = _.get(file, 'createdOn');
      fileData.downloadUrl = _.get(file, 'downloadUrl');
      this.files.push(fileData);
    });
    if (this.files.length) {
      this.isFileDataLoaded = true;
    } else {
      this.isFileDataLoaded = false;
    }
  }

  createChartData(charts, data, downloadUrl) {
    this.chartData = [];
    _.forEach(charts, chart => {
      const chartObj: any = {};
      chartObj.chartConfig = chart;
      chartObj.downloadUrl = downloadUrl;
      chartObj.chartData = _.get(data, 'data');
      chartObj.lastUpdatedOn = _.get(data, 'metadata.lastUpdatedOn');
      this.chartData.push(chartObj);
    });
  }

  renderTable(tables, data) {
    this.tables = [];
    tables = _.isArray(tables) ? tables : [tables];
    _.forEach(tables, table => {
      const tableData: any = {};
      tableData.id = _.get(table, 'id') || `table-${_.random(1000)}`;
      tableData.name = _.get(table, 'name') || 'Table';
      tableData.header = _.get(table, 'columns') || _.get(data, _.get(table, 'columnsExpr'));
      tableData.data = _.get(table, 'values') || _.get(data, _.get(table, 'valuesExpr'));
      tableData.downloadUrl = _.get(table, 'downloadUrl') || this.downloadUrl;
      this.tables.push(tableData);
    });
    this.isTableDataLoaded = true;
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

  setDownloadUrl(url) {
    this.downloadUrl = url;
  }

  downloadCSV(filepath) {
    if (!filepath) {
      filepath = this.downloadUrl;
    }
    this.usageService.getData(filepath).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        const url = _.get(response, 'result.signedUrl');
        if (url) { window.open(url, '_blank'); }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0076);
      }
    }, (err) => {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.m0076);
    });
  }

  transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }
}
