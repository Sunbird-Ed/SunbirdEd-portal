import { Injectable } from '@angular/core';
import { UserService, PermissionService, LearnerService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ServerResponse } from '@sunbird/shared';
@Injectable()
export class ProfileService {
  constructor(private learnerService: LearnerService,
    public userService: UserService, public configService: ConfigService) { }

  public updateAvatar(file) {
    return this.uploadMedia(file).flatMap(results => {
      const req = {
        avatar: results.result.url
      };
      return this.updateProfile(req);
    });
  }
  public updateProfile(request) {
    console.log(request);
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_USER_PROFILE,
      data: data
    };
    return this.learnerService.patch(options).map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, 1000);
        return res;
      }
    );
  }
  updateProfileFieldVisibility(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.UPDATE_PROF_VIS_FIELDS,
      data: data
    };
    return this.learnerService.post(options);
  }
  public uploadMedia(file) {
    const options = {
      url: this.configService.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,
      data: file,
    };
    return this.learnerService.post(options);
  }
  private formatRequest(request) {
    request.userId = this.userService.userid;
    return {
      params: {},
      request: request
    };
  }
  public add(request) {
    const data = this.formatRequest(request);
    const options = {
      url: this.configService.urlConFig.URLS.USER.ADD_SKILLS,
      data: data
    };
    return this.learnerService.post(options).map(
      (res: ServerResponse) => {
        setTimeout(() => {
          this.userService.getUserProfile();
        }, 1000);
        return res;
      });
  }
  public getSkills() {
    console.log('inside service');
    const options = {
      url: this.configService.urlConFig.URLS.USER.SKILLS
    };
    return this.learnerService.get(options);
  }
  // public currentYPosition() {
  //   // Firefox, Chrome, Opera, Safari
  //   if (self.pageYOffset) {
  //     return self.pageYOffset;
  //   }
  //   // Internet Explorer 6 - standards mode
  //   if (document.documentElement && document.documentElement.scrollTop) {
  //     return document.documentElement.scrollTop;
  //   }
  //   // Internet Explorer 6, 7 and 8
  //   if (document.body.scrollTop) {
  //     return document.body.scrollTop;
  //   }
  //   return 0;
  // }


  // public elmYPosition(eID) {
  //   const elm: any = document.getElementById(eID);
  //   let y = elm.offsetTop;
  //   let node = elm;
  //   while (node.offsetParent && node.offsetParent !== document.body) {
  //     node = node.offsetParent;
  //     y += node.offsetTop;
  //   } return y;
  // }


  // public smoothScroll(eID) {
  //   const startY = this.currentYPosition();
  //   const stopY = this.elmYPosition(eID);
  //   const distance = stopY > startY ? stopY - startY : startY - stopY;
  //   if (distance < 100) {
  //     scrollTo(0, stopY); return;
  //   }
  //   let speed = Math.round(distance / 100);
  //   if (speed >= 20) { speed = 20; }
  //   const step = Math.round(distance / 25);
  //   let leapY = stopY > startY ? startY + step : startY - step;
  //   let timer = 0;
  //   if (stopY > startY) {
  //     for (let i = startY; i < stopY; i += step) {
  //       setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
  //       leapY += step; if (leapY > stopY) { leapY = stopY; } timer++;
  //     } return;
  //   }
  //   for (let i = startY; i > stopY; i -= step) {
  //     setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
  //     leapY -= step; if (leapY < stopY) { leapY = stopY; } timer++;
  //   }
  //   return false;
  // }
}
