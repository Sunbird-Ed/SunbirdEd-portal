import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import {ToasterService, NavigationHelperService, LayoutService} from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import {first, takeUntil} from 'rxjs/operators';
import * as _ from 'lodash-es';
import * as $ from 'jquery';
import 'datatables.net';
import * as dayjs from 'dayjs';
import {Subject} from 'rxjs';
import { TncService } from '@sunbird/core';

@Component({
  selector: 'app-user-org-management',
  templateUrl: 'user-org-management.component.html',
  styleUrls: ['user-org-management.component.scss']
})
export class UserOrgManagementComponent implements OnInit, AfterViewInit, OnDestroy {

  public showModal = false;
  public userService: UserService;
  public userProfile;
  public geoData: any = {
    'districts': 0,
    'blocks': 0,
    'schools': 0
  };
  public uploadedDetails = {
    'total_uploaded': 0,
    'accounts_validated': 0,
    'accounts_rejected': 0,
    'accounts_failed': 0,
    'accounts_duplicate': 0,
    'accounts_unclaimed': 0,
    'accounts_eligible': 0
  };
  public geoSummary;
  public validatedUser = {
    'districts': 0,
    'blocks': 0,
    'schools': 0,
    'subOrgRegistered': 0,
    'rootOrgRegistered': 0
  };
  public validatedUserSummary;
  public geoButtonText;
  public teachersButtonText;
  public manageService: ManageService;
  public slug: any = (<HTMLInputElement>document.getElementById('defaultTenant'));
  public geoJSON = 'geo-summary';
  public geoCSV = 'geo-detail';
  public geoDetail = 'geo-summary-district';
  public userJSON = 'user-summary';
  public userCSV = 'user-detail';
  public userSummary = 'validated-user-summary';
  public userDetail = 'validated-user-summary-district';
  public userZip = 'validated-user-detail';
  public GeoTableId = 'GeoDetailsTable';
  public geoTableHeader;
  public geoTabledata = [];
  public userTableId = 'ValidatedUserDetailsTable';
  public userDeclaredDetailsUrl;
  public userTableHeader;
  public userTabledata = [];
  public activatedRoute: ActivatedRoute;
  public resourceService: ResourceService;
  public telemetryImpression: IImpressionEventInput;
  public geoViewInteractEdata: IInteractEventEdata;
  public userDeclaredDetailsEdata: IInteractEventEdata;
  public geoDownloadInteractEdata: IInteractEventEdata;
  public userViewInteractEdata: IInteractEventEdata;
  public userDownloadInteractEdata: IInteractEventEdata;
  public teacherDetailsInteractEdata: IInteractEventEdata;
  public selectFileInteractEdata: IInteractEventEdata;
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();
  public uploadButton;
  public fileUpload = null;
  public selectUserValidationFileInteractEdata: IInteractEventEdata;
  public userValidationUploadInteractEdata: IInteractEventEdata;
  public openUploadModalInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  public adminPolicyDetailsInteractEdata: IInteractEventEdata;
  public showUploadUserModal = false;
  public disableBtn = true;
  public instance: string;
  public adminTncUrl: string;
  public adminTncVersion: string;
  public showAdminTnC = false;
  public showTncPopup = false;

  constructor(activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    userService: UserService, manageService: ManageService, private toasterService: ToasterService, resourceService: ResourceService,
              public layoutService: LayoutService, public telemetryService: TelemetryService, public tncService: TncService) {
    this.userService = userService;
    this.manageService = manageService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    if (this.slug) {
      this.slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
    } else {
      this.slug = 'sunbird';
    }
  }

  ngOnInit(): void {
    this.initLayout();
    this.instance = _.upperCase(this.resourceService.instance);
    this.uploadButton = this.resourceService.frmelmnts.btn.selectCsvFile
    this.geoButtonText = this.resourceService.frmelmnts.btn.viewdetails;
    this.teachersButtonText = this.resourceService.frmelmnts.btn.viewdetails;
    this.geoTableHeader = [this.resourceService.frmelmnts.lbl.admindshheader.index,
    this.resourceService.frmelmnts.lbl.admindshheader.districts,
    this.resourceService.frmelmnts.lbl.admindshheader.blocks,
    this.resourceService.frmelmnts.lbl.admindshheader.schools
    ];
    this.userTableHeader = [this.resourceService.frmelmnts.lbl.admindshheader.index,
    this.resourceService.frmelmnts.lbl.admindshheader.districts,
    this.resourceService.frmelmnts.lbl.admindshheader.blocks,
    this.resourceService.frmelmnts.lbl.admindshheader.schools,
    this.resourceService.frmelmnts.lbl.admindshheader.teachers
    ];
    this.userService.userData$.pipe(first()).subscribe(async (user) => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        this.getAdminPolicyTnC();
        this.fetchDeclaredUserDetails();
        this.slug = await _.get(this.userService, 'userProfile.rootOrg.slug');
        if (user.userProfile && user.userProfile['rootOrg'] && !user.userProfile['rootOrg']['isSSOEnabled']) {
          this.getUserJSON();
        }
        this.getGeoJSON();
        this.getUserSummary();
        this.getGeoDetail();
        this.getUserDetail();
      }
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
  downloadFile(path) {
    window.open(path, '_blank');
  }

  uploadCSV() {
    const file: any = this.fileUpload;
    if (file && file.name.match(/.(csv)$/i)) {
      this.disableBtn = true;
      this.uploadButton = this.resourceService.frmelmnts.btn.uploading;
      const formData = new FormData();
      formData.set('user', file);
      formData.set('operation', 'selfdeclared');
      this.manageService.bulkUserUpload(formData).subscribe(res => {
        this.showUploadUserModal = false;
        this.disableBtn = false;
        this.uploadButton = this.resourceService.frmelmnts.btn.selectCsvFile;
        this.toasterService.success(this.resourceService.frmelmnts.lbl.fileUploadSuccessMessage);
      }, error => {
        this.disableBtn = false;
        this.uploadButton = this.resourceService.frmelmnts.btn.selectCsvFile;
        if (_.get(error, 'error.params.err') === 'MANDATORY_PARAMETER_MISSING') {
          this.toasterService.error(_.get(error, 'error.params.errmsg'));
        } else {
          this.toasterService.error(this.resourceService.frmelmnts.lbl.uploadFileError);
        }
      });
    } else if (file && !(file.name.match(/.(csv)$/i))) {
      this.toasterService.error(this.resourceService.messages.stmsg.m0080);
    }
  }

  public fileChanged(event) {
    this.fileUpload =  (event.target as HTMLInputElement).files[0];
    this.disableBtn = false;
  }
  openModel() {
    this.showUploadUserModal = !this.showUploadUserModal;
    this.fileUpload = null;
  }

  closeUserValidationModal() {
    this.showUploadUserModal = false;
    const interactData = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: []
      },
      edata: {
        id: 'close-upload-validation-status-modal',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    this.telemetryService.interact(interactData);
  }

  fetchDeclaredUserDetails() {
    let channelName = _.get(this.userProfile, 'rootOrg.channel');
    if (channelName) {
      channelName = channelName + '.zip';
      this.manageService.getData('declared_user_detail', channelName).subscribe(response => {
          const url = (_.get(response, 'result.signedUrl'));
          if (url) {
            this.userDeclaredDetailsUrl = url;
          }
        }
      );
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: '/' + this.activatedRoute.snapshot.routeConfig.path,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
      this.geoViewInteractEdata = {
        id: 'geo-details',
        type: 'view',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.userDeclaredDetailsEdata = {
        id: 'user-declared-details',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.geoDownloadInteractEdata = {
        id: 'geo-details',
        type: 'download',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.userViewInteractEdata = {
        id: 'teacher-details',
        type: 'view',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.userDownloadInteractEdata = {
        id: 'teacher-details',
        type: 'download',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.teacherDetailsInteractEdata = {
        id: 'account-details',
        type: 'download',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.selectFileInteractEdata = {
        id: 'upload-user',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.selectUserValidationFileInteractEdata = {
        id: 'select-user-validation-file',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.userValidationUploadInteractEdata = {
        id: 'upload-user-validation-status',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.openUploadModalInteractEdata = {
        id: 'open-upload-validation-status-modal',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.adminPolicyDetailsInteractEdata = {
        id: 'admin-policy-tnc-popup',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      };
      this.telemetryInteractObject = {
        id: this.userService.userid,
        type: 'User',
        ver: '1.0'
      };
    });
  }

  public getUserJSON() {
    this.manageService.getData(this.userJSON, `${this.slug}.json`).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.uploadedDetails = {
          'total_uploaded': result['total'] ? result['total'] : 0,
          'accounts_validated': result['accounts_validated'] ? result['accounts_validated'] : 0,
          'accounts_rejected': result['accounts_rejected'] ? result['accounts_rejected'] : 0,
          'accounts_failed': result['accounts_failed'] ? result['accounts_failed'] : 0,
          'accounts_duplicate': result['accounts_duplicate'] ? result['accounts_duplicate'] : 0,
          'accounts_unclaimed': result['accounts_unclaimed'] ? result['accounts_unclaimed'] : 0,
          'accounts_eligible': result['accounts_eligible'] ? result['accounts_eligible'] : 0
        };
      },
      error => {
        console.log(error);
      }
    );
  }

  public getGeoJSON() {
    this.manageService.getData(this.geoJSON, `${this.slug}.json`).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.geoData = {
          'districts': result['districts'] ? result['districts'] : 0,
          'blocks': result['blocks'] ? result['blocks'] : 0,
          'schools': result['schools'] ? result['schools'] : 0
        };
      },
      error => {
        console.log(error);
      }
    );
  }

  public getUserSummary() {
    this.manageService.getData(this.userSummary, `${this.slug}.json`).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.validatedUser = {
          'districts': result['districts'] ? result['districts'] : 0,
          'blocks': result['blocks'] ? result['blocks'] : 0,
          'schools': result['schools'] ? result['schools'] : 0,
          'subOrgRegistered': result['subOrgRegistered'] ? result['subOrgRegistered'] : 0,
          'rootOrgRegistered': result['rootOrgRegistered'] ? result['rootOrgRegistered'] : 0
        };
      },
      error => {
        console.log(error);
      }
    );
  }

  public getGeoDetail() {
    this.manageService.getData(this.geoDetail, `${this.slug}.json`).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.geoSummary = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  public getUserDetail() {
    this.manageService.getData(this.userDetail, `${this.slug}.json`).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.validatedUserSummary = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  public renderGeoDetails() {
    setTimeout(() => {
      $(`#${this.GeoTableId}`).removeAttr('width').DataTable({
        retrieve: true,
        'columnDefs': [
          {
            'targets': 0,
            'render': (data) => {
              const date = dayjs(data, 'DD-MM-YYYY');
              if (date.isValid()) {
                return `<td><span style="display:none">
                            ${dayjs(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
              }
              return data;
            },
          }],
        'data': this.geoTabledata,
        'searching': false,
        'lengthChange': false
      });
    }, 100);
  }

  public geoTableView() {
    this.geoTabledata = [];
    if (this.geoButtonText === this.resourceService.frmelmnts.btn.viewdetails) {
      this.geoButtonText = this.resourceService.frmelmnts.btn.viewless;
      for (let i = 0; i < this.geoSummary.length; i++) {
        this.geoTabledata.push([
          this.geoSummary[i].index, this.geoSummary[i].districtName,
          this.geoSummary[i].blocks, this.geoSummary[i].schools
        ]);
        if (i === (this.geoSummary.length - 1)) {
          this.renderGeoDetails();
        }
      }
    } else {
      this.geoButtonText = this.resourceService.frmelmnts.btn.viewdetails;
    }
  }

  public renderUserDetails() {
    setTimeout(() => {
      $(`#${this.userTableId}`).removeAttr('width').DataTable({
        retrieve: true,
        'columnDefs': [
          {
            'targets': 0,
            'render': (data) => {
              const date = dayjs(data, 'DD-MM-YYYY');
              if (date.isValid()) {
                return `<td><span style="display:none">
                            ${dayjs(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
              }
              return data;
            },
          }],
        'data': this.userTabledata,
        'searching': false,
        'lengthChange': false
      });
    }, 100);
  }

  public teachersTableView() {
    this.userTabledata = [];
    if (this.teachersButtonText === this.resourceService.frmelmnts.btn.viewdetails) {
      this.teachersButtonText = this.resourceService.frmelmnts.btn.viewless;
      for (let i = 0; i < this.validatedUserSummary.length; i++) {
        this.userTabledata.push([
          this.validatedUserSummary[i].index, this.validatedUserSummary[i].districtName,
          this.validatedUserSummary[i].blocks, this.validatedUserSummary[i].schools,
          this.validatedUserSummary[i].registered
        ]);
        if (i === (this.validatedUserSummary.length - 1)) {
          this.renderUserDetails();
        }
      }
    } else {
      this.teachersButtonText = this.resourceService.frmelmnts.btn.viewdetails;
    }
  }

  public openModal() {
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 500);
  }

  public downloadCSVFile(slug, status, fileName: any) {
    const slugName = status ? slug + '__' + status : slug;
    const downloadFileName = status ? status + '_' + dayjs().format('DDMMYYYY') + '.csv' : undefined;
    this.manageService.getData(slugName, fileName, downloadFileName)
      .subscribe(
        response => {
          const url = (_.get(response, 'result.signedUrl'));
          if (url) { window.open(url, '_blank'); }
        },
        error => {
          console.log(error);
        }
      );
  }

  public downloadZipFile(slug, fileName: any) {
    this.manageService.getData(slug, fileName)
      .subscribe(
        response => {
          if (response && response.result && response.result.signedUrl) {
            window.open(response.result.signedUrl, '_blank');
          } else {
            this.toasterService.error(this.resourceService.messages.emsg.m0076);
          }
        },
        error => {
          this.toasterService.error(this.resourceService.messages.emsg.m0076);
        }
      );
  }

  getAdminPolicyTnC() {
    this.tncService.getAdminTnc().subscribe(data => {
      const adminTncData = JSON.parse(_.get(data, 'result.response.value'));
      if (_.get(adminTncData, 'latestVersion')) {
        this.adminTncVersion = _.get(adminTncData, 'latestVersion');
        this.showAdminTnC = true;
        this.adminTncUrl = _.get(_.get(adminTncData, _.get(adminTncData, 'latestVersion')), 'url');
        this.showAdminTncForFirstUser();
      }
    });
  }
  showAdminTncForFirstUser() {
    const adminTncObj = _.get(this.userProfile, 'allTncAccepted.orgAdminTnc');
    if (!adminTncObj) {
      this.showTncPopup = true;
    } else {
      this.showTncPopup = false;
    }

  }
  openAdminPolicyPopup(closePopup?: boolean) {
    if (closePopup) {
      this.showTncPopup = false;
    } else {
      this.showTncPopup = true;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
