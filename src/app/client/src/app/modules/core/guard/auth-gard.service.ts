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
        this.permissionService = permissionService;
        this.resourceService = resourceService;
        this.config = config;
    }
    /**
    * method CanActivate for guard .
    */
    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> {
        return this.getPermission(activatedRouteSnapshot.data.roles);
    }
    canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> {
        return this.getPermission(activatedRouteSnapshot.url[0].path);
    }

    getPermission(roles) {
        return Observable.create(observer => {
            this.permissionService.permissionAvailable$.subscribe(
                permissionAvailable => {
                    if (permissionAvailable && permissionAvailable === 'success') {
                        if (roles && this.config.rolesConfig.ROLES[roles]) {
                            if (this.permissionService.checkRolesPermissions(this.config.rolesConfig.ROLES[roles])) {
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


