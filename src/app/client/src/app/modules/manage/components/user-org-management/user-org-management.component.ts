import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { first } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Component({
    selector: 'app-user-org-management',
    templateUrl: 'user-org-management.component.html',
    styleUrls: ['user-org-management.component.scss']
})
export class UserOrgManagementComponent {

  public showModal = false;
  public userService: UserService;
  public userProfile: any;
  public geoData: any = {
    'districts': 0,
    'blocks': 0,
    'schools': 0
  };
  public uploadedDetails: any = {
    'total_uploaded': 0,
    'accounts_validated': 0,
    'accounts_rejected': 0,
    'accounts_failed': 0,
    'duplicate_account': 0
  };
  public manageService: ManageService;
  public slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
  public geoJSON: any = 'geo-detail.json';
  public geoCSV: any = 'geo-detail.csv';
  public userJSON: any = 'user-summary.json';
  public userCSV: any = 'user-summary.csv';

  constructor(userService: UserService, manageService: ManageService) {
    this.userService = userService;
    this.manageService = manageService;
  }

  ngOnInit(): void {
    this.userService.userData$.pipe(first()).subscribe(user => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        if (user.userProfile && user.userProfile['rootOrg'] && !user.userProfile['rootOrg']['isSSOEnabled']) {
          this.manageService.getData(this.slug, this.geoJSON).subscribe(
            data => {
              const result = JSON.parse(JSON.stringify(data.result));
              this.uploadedDetails = result;
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    });
    this.manageService.getData(this.slug, this.userJSON).subscribe(
      data => {
        const result = JSON.parse(JSON.stringify(data.result));
        this.geoData = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  public openModal() {
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 500);
  }

  public downloadGeoData() {
    this.manageService.getData(this.slug, this.geoCSV).subscribe(
      data => {
        const downloadUrl = _.get(data.result, this.geoCSV);
        window.open(downloadUrl, '_blank');
      },
      error => {
        console.log(error);
      }
    );
  }

  public downloadUserData() {
    this.manageService.getData(this.slug, this.userCSV).subscribe(
      data => {
        const downloadUrl = _.get(data.result, this.userCSV);
        window.open(downloadUrl, '_blank');
      },
      error => {
        console.log(error);
      }
    );
  }

}
