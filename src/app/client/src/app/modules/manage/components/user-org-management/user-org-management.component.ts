import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { first } from 'rxjs/operators';

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
    'totalUploadedCount': 0,
    'validatedAccountsCount': 0,
    'rejectedAccountsCount': 0,
    'failedAccountsCount': 0,
    'duplicatedAccountsCount': 0
  };
  public manageService: ManageService;
  public slug = (<HTMLInputElement>document.getElementById('defaultTenant')).value;

  constructor(userService: UserService, manageService: ManageService) {
    this.userService = userService;
    this.manageService = manageService;
  }

  ngOnInit(): void {
    this.userService.userData$.pipe(first()).subscribe(user => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
        if (user.userProfile && user.userProfile['rootOrg'] && !user.userProfile['rootOrg']['isSSOEnabled']) {
          this.manageService.getData(this.slug, 'geo-detail.json').subscribe(
            data => {
              console.log(data);
              let result = JSON.parse(JSON.stringify(data.result));
              this.uploadedDetails = result.uploadedDetails;
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    });
    this.manageService.getData(this.slug, 'user-summary.json').subscribe(
      data => {
        console.log(data);
        let result = JSON.parse(JSON.stringify(data.result));
        this.geoData = result.geoData;
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
}
