import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from './../services';
import { ConfigService, ResourceService } from '@sunbird/shared';
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
    * constructor
    * @param {permissionService} permissionService Refrence of permission service to check permission
    * @param {resourceService} resourceService Refrence of resourceService service
    * @param {Router} route  Reference of Router
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
        return this.getPermission(state);
    }

    getPermission(state) {
        return Observable.create(observer => {
            this.permissionService.permissionAvailable$.subscribe(
                permissionAvailable => {
                    if (permissionAvailable && permissionAvailable === 'success') {
                        if (state && state.url.indexOf('/') === 0) {
                            this.currentUrl = state.url.replace('/', '');
                        }
                        this.currentUrl = this.currentUrl.split('/')[0];
                        const rolePermission = this.resourceService.config.rolesConfig.ROLES[this.currentUrl];
                        if (rolePermission) {
                            if (this.permissionService.checkRolesPermissions(rolePermission)) {
                                observer.next(true);
                            } else {
                                this.router.navigate(['home']);
                                observer.next(false);
                            }
                        }
                        observer.complete();
                    } else if (permissionAvailable && permissionAvailable === 'error') {
                        this.router.navigate(['home']);
                        observer.next(false);
                        observer.complete();
                    }
                }
            );
        });
    }

}


