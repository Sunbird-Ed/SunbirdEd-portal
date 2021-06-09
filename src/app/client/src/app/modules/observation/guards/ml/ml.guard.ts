import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@sunbird/core';
import { IUserData,ToasterService,ResourceService } from '@sunbird/shared';
import { take } from 'rxjs/operators';
import * as _ from "lodash-es";

@Injectable({
  providedIn: 'root'
})
export class MlGuard implements CanActivate {
  constructor(public userService: UserService,public resourceService: ResourceService,
    public toasterService: ToasterService,public router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.userData$.pipe(take(1)).toPromise().then((profileData: IUserData) => {
      if (profileData
        && profileData.userProfile
        && profileData.userProfile['profileUserType']
        && (profileData.userProfile['profileUserType']['type'] === "administrator"||profileData.userProfile['profileUserType']['type'] === "leader")
      ) {
        return true
      } else {
        this.toasterService.error(_.get(this.resourceService, 'messages.stmsg.m0145'));
        const queryParam = {
          showEditUserDetailsPopup:true
        }
       this.router.navigate(['profile'],{queryParams:queryParam});
        return false
      }
    }).catch(error => {
      return false
    })
  }
}
