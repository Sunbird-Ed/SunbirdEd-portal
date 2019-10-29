import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-user-org-management',
    templateUrl: 'user-org-management.component.html',
    styleUrls: ['user-org-management.component.scss']
})
export class UserOrgManagementComponent {

  public showModal: boolean = false;
  public userService: UserService;
  public userProfile: any;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  ngOnInit(): void {
    this.userService.userData$.pipe(first()).subscribe(user => {
      if (user && user.userProfile) {
        this.userProfile = user.userProfile;
      }
    });
  }

  public openModal() {
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 500);
  }
}
