import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from './../services';
import { ConfigService, ResourceService, UserProfile, UserData } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   *currentUrl bundle
  */
    public currentUrl = '';
    /**
   * reference of permissionService service.
   */
    public permissionService: PermissionService;
    /**
   * reference of resourceService service.
   */
    public resourceService: ResourceService;
    /**
   * constructor
   */
    constructor(private router: Router, permissionService: PermissionService, resourceService: ResourceService) {
        this.currentUrl = '';
        this.permissionService = permissionService;
        this.resourceService = resourceService;
    }
    /**
    * method CanActivate for  guard.
    */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (state.url.indexOf('/') === 0) {
            this.currentUrl = state.url.replace('/', '');
        }
        this.currentUrl = this.currentUrl.split('/')[0];
        this.permissionService.permissionAvailable$.subscribe((permisionavi: any) => {
            if (permisionavi && permisionavi === 'success') {
                const rolePermission = this.resourceService.config.rolesConfig.ROLES[this.currentUrl];
                console.log(rolePermission);
                if (rolePermission) {
                    if (this.permissionService.checkRolesPermissions(rolePermission)) {
                        return Observable.of(true);
                    }
                }
            }
        });
        return Observable.of(false);
    }


}
