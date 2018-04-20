import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { PermissionService } from './../services';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
/**
 * Service for Route Guards to restrict the access of route
 * based on roles and permission of logedin user.
*/
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
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
     * reference of resourceService service.
    */
   public config: ConfigService;

    /**
    * constructor
    * @param {permissionService} permissionService Refrence of permission service to check permission
    * @param {resourceService} resourceService Refrence of resourceService service
    * @param {Router} route  Reference of Router
    */
    constructor(private router: Router, permissionService: PermissionService, resourceService: ResourceService,
    config: ConfigService) {
        this.currentUrl = '';
        this.permissionService = permissionService;
        this.resourceService = resourceService;
        this.config = config;
    }
    /**
    * method CanActivate for guard .
    */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.getPermission(route.url[0].path);
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.getPermission(state);
    }

    getPermission(state) {
        return Observable.create(observer => {
            this.permissionService.permissionAvailable$.subscribe(
                permissionAvailable => {
                    if (permissionAvailable && permissionAvailable === 'success') {
                        this.currentUrl = state;
                        const rolePermission = this.config.rolesConfig.ROLES[this.currentUrl];
                        if (rolePermission) {
                            if (this.permissionService.checkRolesPermissions(rolePermission)) {
                                observer.next(true);
                            } else {
                                this.router.navigate(['home']);
                                observer.next(false);
                            }
                        } else {
                            this.router.navigate(['home']);
                            observer.next(false);
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


