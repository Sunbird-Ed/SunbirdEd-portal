import { Component, OnInit } from '@angular/core';
import { FrameworkApiService } from 'framework';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  profile: any;
  constructor(private frameworkApi : FrameworkApiService) { }

  ngOnInit() {
    this.profile = this.frameworkApi.getService("userService");
    this.profile.userData$.subscribe(
      user => {
        console.log(this.userProfile);
        if (user) {
          if (!user.err) {
            this.userProfile = user.userProfile;
          } else if (user.err) {

          }
        } else {

        }
      }
    );
    // this.profile = this.frameworkApi.getService("userService");
    // debugger;
    // this.userProfile = this.profile.getUserProfile();
    // this.userProfile.avator ="https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png";
    // this.userProfile.firstName ="Cretation";
    // this.userProfile.lastName ="User";
    // this.userProfile.userName ="ntptest102";
    // this.userProfile.lastLoginTime =1517920664762;
  }

}
