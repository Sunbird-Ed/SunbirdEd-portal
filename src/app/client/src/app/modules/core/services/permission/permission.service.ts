import { ConfigService, ServerResponse, ToasterService, ResourceService, IUserData } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { RolesAndPermissions, Roles } from './../../interfaces';

/**
 * Service to fetch permission and validate user permission
 *
 */
@Injectable()
export class PermissionService {
  /**
   * all roles with actions, including sub roles.
   */
  private rolesAndPermissions: Array<RolesAndPermissions> = [];
  /**
   * main roles with action
   */
  private mainRoles: Array<RolesAndPermissions> = [];
  /**
   * all user role action
   */
  private userRoleActions: Array<string> = [];
  /**
   * all user role
   */
  private userRoles: Array<string> = [];
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
  /**
   * reference of ResourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of LearnerService service.
   */
  public learner: LearnerService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {LearnerService} learner LearnerService reference
   * @param {UserService} userService UserService reference
   */
  constructor(resourceService: ResourceService, config: ConfigService,
    learner: LearnerService, userService: UserService, public toasterService: ToasterService) {
    this.config = config;
    this.learner = learner;
    this.userService = userService;
    this.resourceService = resourceService;
  }
  public initialize() {
    this.getPermissionsData();
  }
  /**
   * method to fetch organization permission and roles.
   */
  private getPermissionsData(): void {
    const option = {
      url: this.config.urlConFig.URLS.ROLES.READ
    };
    this.learner.get(option).subscribe(
      (data: ServerResponse) => {
        if (data.result.roles) {
          this.setRolesAndPermissions(data.result.roles);
        }
      },
      (err: ServerResponse) => {
        this.toasterService.error('Something went wrong, please try again later...');
      }
    );
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
    this.setCurrentRoleActions();
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
    if (this.userRoles && this.userRoles.length > 0) {
      if ((_.intersection(roles, this.userRoles).length === 0)) {
        return false;
      }
      return true;
    }
    return false;
  }

  get allRoles(): Array<RolesAndPermissions> {
    return this.mainRoles;
  }
  getWorkspaceAuthRoles() {
    const authroles = _.find(this.config.rolesConfig.WORKSPACEAUTHGARDROLES, (role, key) => {
      if (this.checkRolesPermissions(role.roles)) {
        return role;
      }
    });
    return authroles;
  }
}
