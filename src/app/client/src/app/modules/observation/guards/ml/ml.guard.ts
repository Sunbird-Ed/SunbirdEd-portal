import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@sunbird/core';
import { IUserData } from '@sunbird/shared';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MlGuard implements CanActivate {
  constructor(public userService: UserService,) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.userData$.pipe(take(1)).toPromise().then((profileData: IUserData) => {
      if (profileData
        && profileData.userProfile
        && profileData.userProfile['profileUserType']
        && profileData.userProfile['profileUserType']['type'] === "administrator"
      ) {
        return true
      } else {
        return false
      }
    }).catch(error => {
      return false
    })
  }
}
