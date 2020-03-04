import { Component, AfterViewInit, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { ToasterService, NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import * as $ from 'jquery';
import 'datatables.net';
import * as moment from 'moment';

@Component({
  selector: 'app-user-org-management',
  templateUrl: 'user-org-management.component.html',
  styleUrls: ['user-org-management.component.scss']
})
export class UserOrgManagementComponent implements OnInit, AfterViewInit {

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
    'duplicate_account': 0,
    'accounts_unclaimed': 0
  };
  public geoSummary;
  public validatedUser = {
    'districts': 0,
    'blocks': 0,
    'schools': 0,
    'teachers': 0
  };
  public validatedUserSummary;
  public geoButtonText;
  public teachersButtonText;
  public manageService: ManageService;
  public slug: any = (<HTMLInputElement>document.getElementById('defaultTenant'));
  public geoJSON = 'geo-summary.json';
  public geoCSV = 'geo-detail.csv';
  public geoDetail = 'geo-summary-district.json';
  public userJSON = 'user-summary.json';
  public userCSV = 'user-detail.csv';
  public userSummary = 'validated-user-summary.json';
  public userDetail = 'validated-user-summary-district.json';
  public userZip = 'validated-user-detail.zip';
  public GeoTableId = 'GeoDetailsTable';
  public geoTableHeader;
  public geoTabledata = [];
  public userTableId = 'ValidatedUserDetailsTable';
  public userTableHeader;
  public userTabledata = [];
  public activatedRoute: ActivatedRoute;
  public resourceService: ResourceService;
  public telemetryImpression: IImpressionEventInput;
  public geoViewInteractEdata: IInteractEventEdata;
  public geoDownloadInteractEdata: IInteractEventEdata;
  public userViewInteractEdata: IInteractEventEdata;
  public userDownloadInteractEdata: IInteractEventEdata;
  public teacherDetailsInteractEdata: IInteractEventEdata;
  public selectFileInteractEdata: IInteractEventEdata;

  constructor(activatedRoute: ActivatedRoute, public navigationhelperService: NavigationHelperService,
    userService: UserService, manageService: ManageService, private toasterService: ToasterService, resourceService: ResourceService) {
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
    });
  }

  public getUserJSON() {
    this.manageService.getData(this.slug, this.userJSON).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.uploadedDetails = {
          'total_uploaded': result['accounts_validated'] + result['accounts_rejected'] + result['accounts_failed']
            + result['duplicate_account'] + result['accounts_unclaimed'],
          'accounts_validated': result['accounts_validated'] ? result['accounts_validated'] : 0,
          'accounts_rejected': result['accounts_rejected'] ? result['accounts_rejected'] : 0,
          'accounts_failed': result['accounts_failed'] ? result['accounts_failed'] : 0,
          'duplicate_account': result['duplicate_account'] ? result['duplicate_account'] : 0,
          'accounts_unclaimed': result['accounts_unclaimed'] ? result['accounts_unclaimed'] : 0
        };
      },
      error => {
        console.log(error);
      }
    );
  }

  public getGeoJSON() {
    this.manageService.getData(this.slug, this.geoJSON).subscribe(
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
    this.manageService.getData(this.slug, this.userSummary).subscribe(
      data => {
        const result = _.get(data, 'result');
        this.validatedUser = {
          'districts': result['districts'] ? result['districts'] : 0,
          'blocks': result['blocks'] ? result['blocks'] : 0,
          'schools': result['schools'] ? result['schools'] : 0,
          'teachers': result['registered'] ? result['registered'] : 0
        };
      },
      error => {
        console.log(error);
      }
    );
  }

  public getGeoDetail() {
    this.manageService.getData(this.slug, this.geoDetail).subscribe(
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
    this.manageService.getData(this.slug, this.userDetail).subscribe(
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
              const date = moment(data, 'DD-MM-YYYY');
              if (date.isValid()) {
                return `<td><span style="display:none">
                            ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
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
              const date = moment(data, 'DD-MM-YYYY');
              if (date.isValid()) {
                return `<td><span style="display:none">
                            ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
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

  public downloadCSVFile(fileName: any) {
    this.manageService.getData(this.slug, fileName)
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

  public downloadZipFile(fileName: any) {
    this.manageService.getData(this.slug, fileName)
      .subscribe(
        response => {
          if (response && response.result && response.result.signedUrl) {
            window.open(response.result.signedUrl, '_blank');
          } else {
            this.toasterService.error(this.resourceService.messages.emsg.m0076);
          }
        },
        error => {
          console.log(error);
          this.toasterService.error(this.resourceService.messages.emsg.m0076);
        }
      );
  }

}
