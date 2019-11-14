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
    'duplicate_account': 0,
    'accounts_unclaimed': 0
  };
  public manageService: ManageService;
  public slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;
  public geoJSON: any = 'geo-summary.json';
  public geoCSV: any = 'geo-detail.csv';
  public userJSON: any = 'user-summary.json';
  public userCSV: any = 'user-detail.csv';

  constructor(userService: UserService, manageService: ManageService) {
    this.userService = userService;
    this.manageService = manageService;
  }

  ngOnInit(): void {
    this.userService.userData$.pipe(first()).subscribe(user => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        if (user.userProfile && user.userProfile['rootOrg'] && !user.userProfile['rootOrg']['isSSOEnabled']) {
          this.slug = _.get(this.userService, 'userProfile.rootOrg.slug');
          this.manageService.getData(this.slug, this.userJSON).subscribe(
            data => {
              const result = JSON.parse(JSON.stringify(data.result));
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
          this.manageService.getData(this.slug, this.geoJSON).subscribe(
            data => {
              const result = JSON.parse(JSON.stringify(data.result));
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
      }
    });
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
        const data = (_.get(response, 'result'));
        const blob = new Blob(
          [data],
          {
            type: 'text/csv;charset=utf-8'
          }
        );
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = downloadUrl;
        a.download = fileName;
        a.click();
        document.body.removeChild(a);
      },
      error => {
        console.log(error);
      }
    );
  }

}
