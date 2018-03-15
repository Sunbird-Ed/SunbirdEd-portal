import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from './../services';
import { ConfigService, ResourceService, UserProfile, UserData } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
/**
 * Service for Route Guards to restrict the access of route
 * based on roles and permission of logedin user.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     *currentUrl
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
    * reference of angular core  router.
    */
    private router: Router;

    /**
    * constructor
    * @param {permissionService}
    * @param {resourceService}
    * @param {Router}
    */
    constructor(private router: Router, permissionService: PermissionService, resourceService: ResourceService) {
        this.currentUrl = '';
        this.permissionService = permissionService;
        this.resourceService = resourceService;
    }
    /**
    * method CanActivate for guard .
    */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (state.url.indexOf('/') === 0) {
            this.currentUrl = state.url.replace('/', '');
        }
        this.currentUrl = this.currentUrl.split('/')[0];
        this.permissionService.permissionAvailable$.subscribe((permisionavi: any) => {
            if (permisionavi && permisionavi === 'success') {
                const rolePermission = this.resourceService.config.rolesConfig.ROLES[this.currentUrl];
                if (rolePermission) {
                    if (this.permissionService.checkRolesPermissions(rolePermission)) {
                        return Observable.of(true);
                    }
                }
            } else {
                this.router.navigate(['home']);
                return Observable.of(false);
            }
        });
        return Observable.of(false);
    }


}
