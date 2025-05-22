import { ConfigService, ServerResponse, ToasterService, ResourceService, IUserData } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { RolesAndPermissions, Roles } from './../../interfaces';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
/**
 * Service to fetch permission and validate user permission
 *
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  /**
   * all roles with actions, including sub roles.
   */
  rolesAndPermissions: Array<RolesAndPermissions> = [];
  /**
   * main roles with action
   */
  mainRoles: Array<RolesAndPermissions> = [];
  /**
   * all user role action
   */
  userRoleActions: Array<string> = [];
  /**
   * all user role
   */
  userRoles: Array<string> = [];
  /**
   * flag to store permission availability
   */
  permissionAvailable = false;
  /**
   * BehaviorSubject with permission status.
   * 1.Undefined if the role not fetched from the server.
   * 2.Success if roles are fetched from server.
   * 3.error if server error while fetching roles.
   */
  public permissionAvailable$ = new BehaviorSubject<string>(undefined);

  public availableRoles$: Observable<any> = this.getPermissionsData().pipe(shareReplay(1));
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {LearnerService} learner LearnerService reference
   * @param {UserService} userService UserService reference
   */
  constructor(private resourceService: ResourceService, private  config: ConfigService,
    private learner: LearnerService, private  userService: UserService, public toasterService: ToasterService) {
  }
  public initialize() {
    this.setCurrentRoleActions();
  }
  /**
   * method to fetch organization permission and roles.
   */
  private getPermissionsData() {
    const option = {
      url: this.config.urlConFig.URLS.ROLES.READ
    };   
    return this.learner.get(option).pipe(tap(
      (data: ServerResponse) => {
        if (data.result.roles) {
          this.setRolesAndPermissions(data.result.roles);
        }
      },
      (err: ServerResponse) => {
        this.toasterService.error('Something went wrong, please try again later...');
      }
    ));
  }
  /**
   * method to process roles and actions
   * @param {Array<Roles>} data ConfigService reference
   */
  private setRolesAndPermissions(roles: Array<Roles>): void {
    _.forEach(roles, (role) => {
      const mainRole = { role: role.id, actions: [], roleName: role.name };
      _.forEach(role.actionGroups, (actionGroup) => {
        const subRole = { role: actionGroup.id, actions: actionGroup.actions, roleName: actionGroup.name };
        mainRole.actions = _.concat(mainRole.actions, actionGroup.actions);
        this.rolesAndPermissions.push(subRole);
      });
      this.mainRoles.push(mainRole);
      this.rolesAndPermissions.push(mainRole);
    });
    this.rolesAndPermissions = _.uniqBy(this.rolesAndPermissions, 'role');
  }
  /**
   * method to process logged in user roles and actions
   * @param {ServerResponse} data ConfigService reference
   */
  private setCurrentRoleActions(): void {
    this.userService.userData$.subscribe((user: IUserData) => {
      if (user && !user.err) {
        this.userRoles = user.userProfile.userRoles;
        _.forEach(this.userRoles, (role) => {
          const roleActions = _.filter(this.rolesAndPermissions, { role: role });
          if (_.isArray(roleActions) && roleActions.length > 0) {
            this.userRoleActions = _.concat(this.userRoleActions, _.map(roleActions[0].actions, 'id'));
          }
        });
        this.permissionAvailable$.next('success');
        this.permissionAvailable = true;
      } else if (user && user.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005 || 'Something went wrong, please try again later...');
        this.permissionAvailable$.next('error');
      }
    });
  }
  /**
   * method to validate permission
   * @param {Array<string>}  roles roles to validate.
   */
  public checkRolesPermissions(roles: Array<string>): boolean {
    if ((_.intersection(roles, this.userRoles).length)) {
      return true;
    }
    return false;
  }

  get allRoles(): Array<RolesAndPermissions> {
    return this.mainRoles;
  }
  getWorkspaceAuthRoles() {
    const authRoles = _.find(this.config.rolesConfig.WORKSPACEAUTHGARDROLES, (role, key) => {
      if (this.checkRolesPermissions(role.roles)) {
        return role;
      }
    });
    return authRoles;
  }
}
