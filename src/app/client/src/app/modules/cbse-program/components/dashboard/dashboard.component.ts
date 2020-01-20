import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PublicDataService, UserService, ActionService, ContentService } from '@sunbird/core';
import { ConfigService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';
import * as $ from 'jquery';
import 'datatables.net';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';
import { forkJoin, throwError, Subscription } from 'rxjs';
import { CbseProgramService } from '../../services';
import { IDashboardComponentInput, ISessionContext } from '../../interfaces';
import { ProgramTelemetryService } from '../../../program/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @Input() dashboardComponentInput: IDashboardComponentInput;
  private textBookMeta: any;
  public dtOptions: any = {};
  public hierarchyObj = {};
  textBookChapters: Array<any>;
  reports: Array<any>;
  selectedReport: string;
  headers: Array<any> = [];
  headersTooltip: Array<any> = [];
  showLoader = false;
  selectedTextbook: string;
  tableData: Array<any>;
  UnitLevels: Array<any> = [];
  contentTypes: Array<any> = [];
  textbookList: Array<any>;
  programLevelData: Array<any>;
  public sessionContext: ISessionContext = {};
  public programContext: any;
  public telemetryImpression: any;
  public telemetryPageId = 'dashboard';

  constructor(public publicDataService: PublicDataService, public configService: ConfigService, public userService: UserService,
    public actionService: ActionService, public toasterService: ToasterService, private cbseService: CbseProgramService,
    public contentService: ContentService, public programTelemetryService: ProgramTelemetryService,
    public activeRoute: ActivatedRoute, public router: Router, private navigationHelperService: NavigationHelperService) {}

  ngOnInit() {
    this.sessionContext = this.dashboardComponentInput.sessionContext;
    this.programContext = this.dashboardComponentInput.programContext;
    this.reports = [{ name: 'Program Level Report Status' }];
    this.selectedReport = 'Program Level Report Status';
    this.generateProgramLevelData(this.selectedReport);
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programContext.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  refreshReport() {
    this.generateProgramLevelData(this.selectedReport);
  }

  downloadReport() {
    const options = {
      filename: `${this.selectedReport}`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Texbook: ${this.selectedTextbook ? this.selectedTextbook : ''}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.tableData);
  }

  getUnitWithChildren(data) {
    const self = this;
    const tree = data.map(child => {
      const treeItem = {
        identifier: child.identifier,
        name: child.name,
        contentType: child.contentType,
        topic: child.topic,
        status: child.status
      };
      const textbookUnit = _.find(child.children, [
        'contentType',
        'TextBookUnit'
      ]);
      if (child.children) {
        const treeUnit = self.getUnitWithChildren(child.children);
        const treeChildren = treeUnit.filter(
          item => item.contentType === 'TextBookUnit'
        );
        const treeLeaf = treeUnit.filter(
          item => item.contentType !== 'TextBookUnit'
        );
        treeItem['children'] = treeChildren.length > 0 ? treeChildren : null;
        treeItem['leaf'] = treeLeaf.length > 0 ? treeLeaf : null;
      }
      return treeItem;
    });
    return tree;
  }

  getprogramLevelCount(identifier: string) {
    const req = {
      url: 'content/v3/hierarchy/' + identifier, // `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: { 'mode': 'edit' }
    };
    return this.actionService.get(req).pipe(map((response) => {
      const collectionData = response.result.content;
        let textBookLevelCount;
        const collectionHierarchy = this.getUnitWithChildren(
          collectionData.children
        );
        textBookLevelCount = this.getTextbookLevelCount(collectionHierarchy);
        return textBookLevelCount;
    }),
    catchError((err) => {
      const errInfo = { errorMsg: 'Fetching Textbook Hierarchy failed, Please try later' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  getTextbookLevelCount(collectionHierarchy) {
    const textbookLevelCount = {
      level: {}, content: {}
    };
    let n = 1;
    const recursive = (level) => {
      if (level.contentType === 'TextBookUnit') {
        textbookLevelCount.level[`L${n}`]  ? textbookLevelCount.level[`L${n}`]++ : textbookLevelCount.level[`L${n}`] = 1;
        if (level.leaf && level.leaf.length > 0) {
          _.forEach(level.leaf, (resource) => {
            if (resource.status === 'Live') {
              // tslint:disable-next-line:max-line-length
              textbookLevelCount.content[resource.contentType] ? textbookLevelCount.content[resource.contentType] ++ : textbookLevelCount.content[resource.contentType] = 1;
            }
          });
        }
        if (level.children && level.children.length > 0) {
          n = n + 1;
          _.forEach(level.children, (child) => {
            recursive(child);
          });
        }
      }
    };
    _.forEach(collectionHierarchy, (level) => {
      n = 1;
      recursive(level);
    });
    return textbookLevelCount;

  }

  generateProgramLevelData(report) {
    let apiRequest;
    const levels = [];
    const contents = [];
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'status': ['Draft', 'Live'],
            'contentType': 'TextBook'
          }
        }
      }
    };
    if (this.sessionContext && this.sessionContext.board) {
      req.data.request.filters['board'] = this.sessionContext.board;
    }
    if (this.sessionContext && this.sessionContext.framework) {
      req.data.request.filters['framework'] = this.sessionContext.framework;
    }
    if (this.sessionContext && this.sessionContext.medium) {
      req.data.request.filters['medium'] = this.sessionContext.medium;
    }
    if (this.sessionContext && this.sessionContext.programId) {
      req.data.request.filters['programId'] = this.sessionContext.programId;
    }
    this.showLoader = true;
    this.contentService.post(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Fetching of textbook list failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      const filteredTextbook = [];
      // --> The textbook of either of status ['Live', 'Draft'] && In case of both 'Draft' is shown to avoid duplicate.
      const group_arr = _.groupBy(res.result.content, 'identifier');
      _.forEach(group_arr,  (val) => {
        if (val.length > 1) {
          const ab = _.find(val, (v) => {
            return v.status === 'Draft';
          });
          filteredTextbook.push(ab);
        } else {
          filteredTextbook.push(val[0]);
        }
      });
      this.textbookList = filteredTextbook;
      apiRequest = [...this.textbookList.map(book => this.getprogramLevelCount(book.identifier))];

      forkJoin(apiRequest).subscribe(data => {
        let i = 0;

        this.programLevelData = data.map(book => {
            book['Textbook Name'] = this.textbookList[i].name;
            book['Subject'] = this.textbookList[i].subject;
            book['Grade'] = this.textbookList[i].gradeLevel[0];
            book['Identifier'] = this.textbookList[i].identifier;
            book['Medium'] = this.textbookList[i].medium;
            i ++;
            return book;
        });
        _.forEach(this.programLevelData, (obj) => {
          _.mapKeys(obj.level, (value, key) => {
            levels.push(key);
          });
          _.mapKeys(obj.content, (value, key) => {
            contents.push(key);
          });
        });
        this.UnitLevels = _.uniq(levels);
        this.contentTypes = _.uniq(contents);
        this.generateTableData(report);
     });
    });
  }

  generateHeaderDetails(report) {
    this.headers = [];
     if (report === 'Program Level Report Status') {
      const levelHeaders = [{
        name: 'L1', tip: 'Count of level 1 textbook units (Chapter)'
      }, {
        name: 'L2', tip: 'Count of level 2 textbook units (Topics)'
      }, {
        name: 'L3', tip: 'Count of level 3 textbook units (Sub-topics)'
      }, {
        name: 'L4', tip: 'Count of level 4 textbook units'
      }, {
        name: 'L5', tip: 'Count of level 5 textbook units'
      }];
      _.forEach(this.UnitLevels, (v, i) => {
        this.headers[i] = levelHeaders[i];
      });
      _.forEach(this.contentTypes, (v, i) => {
         this.headers[this.UnitLevels.length + i] = {name: v, tip: `Number of ${v} Set`};
      });
    }
  }

  generateTableData(report) {
    this.generateHeaderDetails(report);
    if (report === 'Program Level Report Status') {
      this.tableData = _.map(this.programLevelData, (obj) => {
        let result = obj;
       if (result.level) {
        result = {...result, ...result.level};
        delete result.level;
       }
       if (result.content) {
        result = {...result, ...result.content};
        delete result.content;
       }
       _.forEach([...this.UnitLevels, ...this.contentTypes], (val) => {
        result[val] ? (result[val] = result[val]) : (result[val] = 0) ;
       });
       return result;
      });
      this.initializeDataTable(report);
    }
  }

  initializeDataTable(report) {
    const dtOptions = {
      paging: false,
      searching: false,
      info: false,
      destroy: true,
      order: []
    };
    this.showLoader = false;
    if (report === 'Program Level Report Status') {
      setTimeout(() => {
        $('#ProgramLevelReportStatus').DataTable(dtOptions);
      }, 0);
    }
  }
}
