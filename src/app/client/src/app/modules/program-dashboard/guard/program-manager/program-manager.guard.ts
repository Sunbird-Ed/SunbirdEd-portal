import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService,KendraService } from '@sunbird/core';
import { IUserData,ConfigService } from '@sunbird/shared';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class programManagerGuard implements CanActivate {
  constructor(public userService: UserService,public kendraService:KendraService,public config:ConfigService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  {
      // return this.getPermission();
      
      // if(this.isAuthenticated()){
        // return true;
      // }else {
      //   return false;
      // }

      return this.kendraService.get({ 
        url:
          this.config.urlConFig.URLS.KENDRA.PLATFORM_ROLES
      }).pipe(map(response => {
        if(response && response['result']) {

          let roles = response['result'].map(data=>{ return data.code });
          console.log("response",roles);
          if(roles.includes("PM")){
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }));        
      
       

      
   
    // return this.userService.userData$.pipe(take(1)).toPromise().then((profileData: IUserData) => {
    //   if (profileData
    //     && profileData.userProfile
    //     && profileData.userProfile['profileUserType']
    //     // && (profileData.userProfile['profileUserType']['type'] === "administrator"|| 
    //     // profileData.userProfile['profileUserType']['type'] === "leader" )
    //   ) {
    //     return true
    //   } else {
    //     return false
    //   }
    // }).catch(error => {
    //   return false
    // })
  }

  // getPermission(){
  //   return Observable.create(observer => {

        //      const paramOptions = { 
        //   url:
        //     this.config.urlConFig.URLS.KENDRA.PROGRAMS_BY_PLATFORM_ROLES
        // };
  //         this.kendraService.get(paramOptions).subscribe(
  //             permissionAvailable => {
                 
  //             }
  //         );
      
  // });

  // }

  // isAuthenticated(): boolean {
    // const paramOptions = { 
    //   url:
    //     this.config.urlConFig.URLS.KENDRA.PROGRAMS_BY_PLATFORM_ROLES
    // };
    // this.kendraService.get(paramOptions).subscribe(data => {
    //    console.log("data",data);

    //    if(data){
    //      return true;
    //    } else {
    //      return false
    //    }

    // }, error => {
    //   return false
    // });
  // }


  
}