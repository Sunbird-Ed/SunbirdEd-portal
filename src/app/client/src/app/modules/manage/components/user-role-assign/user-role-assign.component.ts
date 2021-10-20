import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SearchService, UserService, PermissionService, RolesAndPermissions } from '@sunbird/core';
import { ToasterService, ResourceService, ServerResponse } from '@sunbird/shared';
import { ManageService } from '../../services/manage/manage.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-user-role-assign',
  templateUrl: './user-role-assign.component.html',
  styleUrls: ['./user-role-assign.component.scss']
})
export class UserRoleAssignComponent implements OnInit {
  userDetailsForm: FormGroup;
  sbFormBuilder: FormBuilder;
  showingResults = false;
  showCards = false;
  showAssignRole = false;
  showNoResult = false;
  enableSubmitBtn = false;
  userRole = [];
  removeRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'PUBLIC'];
  rootOrgRoles = [];
  userObj: any;
  key: string;
  allRoles: Array<RolesAndPermissions>;
  private searchService: SearchService;
  private toasterService: ToasterService;
  private resourceService: ResourceService;
  private userService: UserService;
  orgList = [];
  role = [];
  orgName = [];

  constructor(searchService: SearchService,
    userService: UserService,
    resourceService: ResourceService, private permissionService: PermissionService,
    toasterService: ToasterService, formBuilder: FormBuilder,
    private route: Router,
    private manageService: ManageService) {
    this.searchService = searchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.userService = userService;
    this.sbFormBuilder = formBuilder;
    this.initializeFormFields();
  }

  ngOnInit(): void {
    this.removeRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'PUBLIC'];
    this.getAllRoles(this.removeRoles);
    this.getOrgDetails();
  }
  initializeFormFields() {
    this.userDetailsForm = new FormGroup({
      role: new FormControl(''),
      orgName: new FormControl('')
    });
  }
  enableAssignRole() {
    this.showAssignRole = !this.showAssignRole ? true : false;
  }
  editRole(item) {
    console.log(item);
    this.orgName = [];
    this.role = [];
    this.orgName.push(item.orgName);
    this.role.push(item.roleName);
    this.showAssignRole = !this.showAssignRole ? true : false;
  }
  deleteRole(item) {
    const roleToDelete =[]
    roleToDelete.push({
      role: item.role,
      operation: 'remove',
      scope: [{
        organisationId: item.orgId
      }]
    });
    const data = { userId: this.userObj.userId, roles: roleToDelete };
    this.updateRoleForUser(data);
  }
  getOrgDetails() {
    const userRoles = this.userService.UserOrgDetails;
    for (let key in userRoles) {
      if (key === 'ORG_ADMIN') {
        this.orgList.push(userRoles[key]);
      }
    }
  }
  dismissRoleAssign() {
    this.showAssignRole = false;
  }
  goBack() {
    this.showingResults = false;
  }
  getAllRoles(removeRoles) {
    this.permissionService.availableRoles$.subscribe(params => {
      this.allRoles = this.permissionService.allRoles;
      this.allRoles = _.filter(this.allRoles, (role) => {
        return (_.indexOf(removeRoles, role.role) < 0)
      });
    });
  }

  onEnter(key) {
    this.key = key;
    const searchParams = {
      filters: {
        userName: this.key
      }
    };
    this.userRole = [];
    this.searchService.globalUserSearch(searchParams).subscribe(
      (apiResponse) => {
        if (apiResponse.result.response.count && apiResponse.result.response.content.length > 0) {
          this.showingResults = true;
          this.userObj = apiResponse.result.response.content[0]
          this.manipulateUserObject(this.userObj);
        } else {
          this.showNoResult = true
        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }
  manipulateUserObject(user) {
    _.forEach(user.roles, (role) => {
      let userObj = null;
      if (_.findIndex(role.scope, { 'organisationId': this.userService.rootOrgId }) >= 0) {
        // this.removeRoles.push(role.role);
        userObj = {
          role: role.role,
          orgName: this.userService.rootOrgName,
          orgId: this.userService.rootOrgId
        }
        this.rootOrgRoles.push(role.role);
        _.forEach(this.allRoles, (userRole) => {
          if ((userRole.role === role.role)) {
            userObj['roleName'] = userRole.roleName;
          }
        });
        this.userRole.push(userObj);
      }
    })
    //this.getAllRoles(this.removeRoles);
    if (this.userRole.length > 0) {
      this.showCards = true;
    }
  }
  onSubmitForm() {
    this.updateProfile();
    this.enableAssignRole();
  }
  redirect(): void {
    this.route.navigate(['/manage'], {});
  }
  updateRoleForUser(data) {
    this.manageService.updateRoles(data)
      .subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0049);
          this.redirect();
          this.initializeFormFields();
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0020);
          this.redirect();
        }
      );
  }
  updateProfile() {
    // create school and roles data
    const roles = !_.isEmpty(this.userDetailsForm.controls.role.value) ? this.userDetailsForm.controls.role.value : ['PUBLIC'];
    const orgId = !_.isEmpty(this.userDetailsForm.controls.orgName.value) ? this.userDetailsForm.controls.orgName.value[0] : '';
    const newRoles = [...roles];
    const mainRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'SYSTEM_ADMIN'];
    _.remove(newRoles, (role) => {
      return _.includes(mainRoles, role);
    });
    const rolesAdded = _.concat(newRoles, _.intersection(mainRoles, this.rootOrgRoles));
    const data = { userId: this.userObj.userId, roles: this.getRolesReqBody(rolesAdded, this.rootOrgRoles, orgId) };
    this.updateRoleForUser(data);
  }
  getRolesReqBody(newRoles, currentRoles, orgId) {
    const reqBody = [];
    // Get newly added roles array comparing to existing roles
    const newlyAddedRoles = _.difference(newRoles, currentRoles);
    // Get deleted roles from existing roles
    const masterRoles = [...currentRoles, ...newlyAddedRoles];
    _.forEach(masterRoles, (role) => {
        reqBody.push({
          role: role,
          operation: 'add',
          scope: [{
            organisationId: orgId
          }]
        });
    });
    return reqBody;
  }

}