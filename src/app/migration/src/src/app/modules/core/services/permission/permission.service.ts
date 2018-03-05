import { ConfigService, ServerResponse } from '@sunbird/shared';
import { LearnerService } from './../learner/learner.service';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Service to fetch permission and validate user permission
 *
 */
@Injectable()
export class PermissionService {
  /**
   * all roles with actions, including sub roles.
   */
  private rolesAndPermissions: any[] = [];
  /**
   * main roles with action
   */
  private mainRoles: any[] = [];
  /**
   * all user role action
   */
  private userRoleActions: any[] = [];
  /**
   * all user role
   */
  private userRoles: any[] = [];
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
   * reference of config service.
   */
  public config: ConfigService;
    /**
   * reference of HttpClient service.
   */
  public http: HttpClient;
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
   * @param {HttpClient} http HttpClient reference
   * @param {LearnerService} learner LearnerService reference
   * @param {UserService} userService UserService reference
   */
  constructor(config: ConfigService, http: HttpClient, learner: LearnerService, userService: UserService) {
    this.config = config;
    this.http = http;
    this.learner = learner;
    this.userService = userService;
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
        this.setRolesAndPermissions(data);
      },
      (err: ServerResponse) => {

      }
    );
  }
  /**
   * method to process roles and actions
   * @param {ServerResponse} data ConfigService reference
   */
  private setRolesAndPermissions(data: ServerResponse): void {
    const rolePermissions = _.cloneDeep(data.result.roles);
    _.forEach(rolePermissions, (r, p) => {
      const mainRole = { role: r.id, actions: [], roleName: r.name };
      _.forEach(r.actionGroups, (ag) => {
        const subRole = { role: ag.id, actions: ag.actions, roleName: ag.name };
        mainRole.actions = _.concat(mainRole.actions, ag.actions);
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
    this.userService.userData$.subscribe( user => {
        if (user) {
          if (!user.err) {
            this.userRoles = user.userProfile.userRoles;
            _.forEach(this.userRoles,  (r) => {
              const roleActions = _.filter(this.rolesAndPermissions, { role: r });
              if (_.isArray(roleActions) && roleActions.length > 0) {
                this.userRoleActions = _.concat(this.userRoleActions,
                  _.map(roleActions[0].actions, 'id'));
              }
            });
            this.permissionAvailable$.next('success');
            this.permissionAvailable = true;
          } else if (user.err) {
            this.permissionAvailable$.next('error');
          }
        } else {

        }
      }
    );
  }
  /**
   * method to validate permission
   * @param {string[]}  roles roles to validate.
   * @param {boolean} flag  flag. True if roles must be needed.
   */
  public checkRolesPermissions(roles, flag): boolean {
    if (this.userRoles && this.userRoles.length > 0) {
      if (!this.checkActionsPermissions(roles, flag)) {
        if (_.isArray(roles)) {
          if ((_.intersection(roles, this.userRoles).length === 0) && !flag) {
            return true;
          }
          return ((_.intersection(roles, this.userRoles).length > 0) && flag);
        }
      } else {
        return true;
      }
    }
    return false;
  }
  /**
   * method to role action.
   * @param {string[]}  roles roles to validate.
   * @param {boolean} flag  flag. True if roles must be needed.
   */
  checkActionsPermissions(roles, flag) {
    if (_.isArray(roles)) {
      if ((_.intersection(roles, this.userRoleActions).length === 0) && !flag) {
        return false;
      }
      return ((_.intersection(roles, this.userRoleActions).length > 0) && flag);
    }
    return false;
  }
}
