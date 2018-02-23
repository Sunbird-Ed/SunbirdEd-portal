import { ConfigService } from './../config/config.service';
import { LearnerService } from './../learner/learner.service';
import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PermissionService {
  private rolesAndPermissions: any[] = [];
  private mainRoles: any[] = [];
  public permissionAvailable = false;
  private currentRoleActions: any[] = [];
  private userRoles: any[] = [];
  public permissionAvailable$ = new BehaviorSubject<string>(undefined);

  constructor(public config: ConfigService, public http: HttpClient, public learner: LearnerService, public userService: UserService) {
    this.getPermissionsData();
  }
  private getPermissionsData() {
    const option = {
      url: this.config.urlConFig.URLS.ROLES.READ
    };
    this.learner.get(option).subscribe(
      data => {
        this.setRolesAndPermissions(data);
        console.log(data);
      },
      err => {
        console.log('error in getting permission', err);
      }
    );
  }
  private setRolesAndPermissions(data) {
    const rolePermissions = _.cloneDeep(data.result.roles);
    _.forEach(rolePermissions, (r, p) => {
      const mainRole = { role: r.id, actions: [], roleName: r.name };
      this.mainRoles.push(mainRole);
      _.forEach(r.actionGroups, (ag) => {
        const subRole = { role: ag.id, actions: ag.actions, roleName: ag.name };
        mainRole.actions = _.concat(mainRole.actions, ag.actions);
        this.rolesAndPermissions.push(subRole);
      });
      this.rolesAndPermissions.push(mainRole);
    });
    this.rolesAndPermissions = _.uniqBy(this.rolesAndPermissions, 'role');
    this.setCurrentRoleActions();
  }

  private setCurrentRoleActions() {
    this.userService.userData$.subscribe( user => {
        if (user) {
          if (!user.err) {
            this.userRoles = user.userProfile.userRoles;
            _.forEach(this.userRoles,  (r) => {
              const roleActions = _.filter(this.rolesAndPermissions, { role: r });
              if (_.isArray(roleActions) && roleActions.length > 0) {
                this.currentRoleActions = _.concat(this.currentRoleActions,
                  _.map(roleActions[0].actions, 'id'));
              }
            });
            this.permissionAvailable = true;
            this.permissionAvailable$.next('success');
          } else if (user.err) {
            this.permissionAvailable$.next('error');
          }
        } else {

        }
      }
    );
  }

  public checkRolesPermissions(data, flag) {
    if (this.userRoles && this.userRoles.length > 0) {
      if (!this.checkActionsPermissions(data, flag)) {
        if (_.isArray(data)) {
          if ((_.intersection(data, this.userRoles).length === 0) && !flag) {
            return true;
          }
          return ((_.intersection(data, this.userRoles).length > 0) && flag);
        }
      } else {
        return true;
      }
    }
    return false;
  }

  checkActionsPermissions(data, flag) {
    if (_.isArray(data)) {
      if ((_.intersection(data, this.currentRoleActions).length === 0) && !flag) {
        return false;
      }
      return ((_.intersection(data, this.currentRoleActions).length > 0) && flag);
    }
    return false;
  }
}
