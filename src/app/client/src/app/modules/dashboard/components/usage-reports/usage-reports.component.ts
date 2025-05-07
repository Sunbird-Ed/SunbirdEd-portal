import { IInteractEventEdata, TelemetryInteractDirective, IImpressionEventInput } from '@sunbird/telemetry';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CourseProgressService, UsageService } from './../../services';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService, TncService } from '@sunbird/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  ToasterService,
  ResourceService,
  INoResultMessage,
  NavigationHelperService,
  LayoutService
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicDataService } from '../../../../../../../../../src/app/client/src/app/modules/core/services/public-data/public-data.service';
import { ConfigService } from '../../../../../../../../../src/app/client/src/app/modules/shared/services/config/config.service';
import { HttpErrorResponse } from '@angular/common/http'; 
import { FormService } from '../../../../modules/core/services/form/form.service';

@Component({
  selector: 'app-usage-reports',
  templateUrl: './usage-reports.component.html',
  styleUrls: ['./usage-reports.component.scss']
})
export class UsageReportsComponent implements OnInit, AfterViewInit {

  provinceList: { label: string; value: string }[] = [];
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
  public courseProgressService: CourseProgressService;
  layoutConfiguration: any;
  private unsubscribe$ = new Subject<void>();
  reportViewerTncVersion: string;
  reportViewerTncUrl: string;
  showTncPopup = false;
  userProfile;
  @ViewChild(TelemetryInteractDirective) telemetryInteractDirective;
  isSubmitting: boolean;
  UserCreationService: any;
  constructor(private usageService: UsageService, private sanitizer: DomSanitizer,
    public userService: UserService, private toasterService: ToasterService,
    public resourceService: ResourceService, activatedRoute: ActivatedRoute, private router: Router,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService,
    courseProgressService: CourseProgressService, public tncService: TncService, private fb: FormBuilder,
    private http: HttpClient , private snackBar: MatSnackBar, public publicDataService: PublicDataService,
  public configService: ConfigService,  private formService: FormService) {
    this.activatedRoute = activatedRoute;
    this.courseProgressService = courseProgressService;
  }
  subPersonaList: string[] = [];

  userForm!: FormGroup;
  rolesList = ['Public', 'Content Creater', 'Content Reviewer']; 

  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[A-Za-z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{6,20}$')]],
      description: ['', [Validators.maxLength(250)]],
      province: ['', Validators.required]
    });
    const formParams = {
      formType: 'profileConfig_v2',
      formAction: 'get',
      contentType: 'default'
    };
    this.formService.getFormConfig(formParams, '01429195271738982411', 'data.fields')
    .subscribe({
      next: (fields) => {
        const provinceField = fields.find(f => f.code === 'province');
        this.provinceList = provinceField?.templateOptions?.options || [];
      },
      error: (err) => {
        console.error('Failed to load provinces:', err);
      }
    });
    this.initLayout();
    const reportsLocation = (<HTMLInputElement>document.getElementById('reportsLocation')) ? (<HTMLInputElement>document.getElementById('reportsLocation')).value : '';
    this.slug = _.get(this.userService, 'userProfile.rootOrg.slug');
    this.userService.userData$.pipe(first()).subscribe(async (user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        this.getReportViewerTncPolicy();
      }
    });
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

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
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
        }

      }, err => { console.log(err); });
  }

  renderFiles(files, data) {
    this.files = [];
    _.forEach(files, file => {
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
    _.forEach(this.files, file => {
      const path = (file.downloadUrl).replace('/reports/', '');
      const requestParams = {
        params: {
          fileNames: JSON.stringify({ path })
        },
        telemetryData: this.activatedRoute
      };
      this.courseProgressService.getReportsMetaData(requestParams).subscribe((response) => {
        if (_.get(response, 'responseCode') === 'OK') {
          file.size = (_.get(response, 'result.path.fileSize')) / 1024;
          if (_.get(response, 'result.path.lastModified')) {
            file.createdOn = dayjs(new Date(_.get(response, 'result.path.lastModified'))).format('DD MMM YYYY');
          } else {
            file.createdOn = '';
          }
        }
      });
    });
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
      this.toasterService.error(this.resourceService.messages.emsg.m0076);
    });
  }

  transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }

  selectedTabChange(event) {
    const { downloadURL } = _.get(event, 'tab.textLabel');
    downloadURL && this.setDownloadUrl(downloadURL);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const formData = this.userForm.value;
  
      const payload = {
        request: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: 'Fmps@1234',
          roles: formData.roles.map((role: string) => role.toUpperCase()),
          nationalId: formData.nationalId || '',
          description: formData.description || '',
          framework: {
            category: [],
            id: ['FMPS'],
            language: ['English', 'French'],
            organisation: ['FMPS'],
            profileConfig: [
              JSON.stringify({
                category: formData.category || '',
                trainingGroup: formData.trainingGroup || '',
                cin: formData.cin || '',
                idFmps: formData.idFmps || '',
                province: formData.province || ''
              })
            ]
          }
        }
      };
  
      // Calling createUser() from the service and subscribing to the observable
      this.userService.createUser(payload).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.snackBar.open('User created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.userForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err?.error?.params?.errmsg || 'User creation failed', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
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

goBack() {
  this.navigationhelperService.goBack();
}

  showReportViewerTncForFirstUser() {
     const reportViewerTncObj = _.get(this.userProfile, 'allTncAccepted.reportViewerTnc');
     if (!reportViewerTncObj) {
     this.showTncPopup = true;
     }
  }
}
