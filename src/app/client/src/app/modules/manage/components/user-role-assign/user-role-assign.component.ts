import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { SearchService, UserService, PermissionService, RolesAndPermissions } from '@sunbird/core';
import { ToasterService, ResourceService, ServerResponse,ConfigService } from '@sunbird/shared';
import { ManageService } from '../../services/manage/manage.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-user-role-assign',
  templateUrl: './user-role-assign.component.html',
  styleUrls: ['./user-role-assign.component.scss']
})
export class UserRoleAssignComponent implements OnInit {
  userDetailsForm: UntypedFormGroup;
  sbFormBuilder: UntypedFormBuilder;
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
  userAssignedRole = [];
  allRoles: Array<RolesAndPermissions>;
  private searchService: SearchService;
  private toasterService: ToasterService;
  private resourceService: ResourceService;
  private userService: UserService;
  orgList = [];
  role = [];
  orgName = [];
  isEditRole = false;
  showDelete = false;
  item: any;
  instance: string;
  avatarConfig = {
    size: this.config.constants.SIZE.LARGE,
    view: this.config.constants.VIEW.VERTICAL,
    isTitle:false
  };
  constructor(searchService: SearchService,
    userService: UserService,
    resourceService: ResourceService, private permissionService: PermissionService,
    toasterService: ToasterService, formBuilder: UntypedFormBuilder,
    private route: Router,
    private manageService: ManageService,
    private config: ConfigService) {
    this.searchService = searchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.userService = userService;
    this.sbFormBuilder = formBuilder;
    this.initializeFormFields();
  }

  ngOnInit(): void {
    this.instance = _.upperFirst(_.toLower(this.resourceService.instance || 'SUNBIRD'));
    this.removeRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'PUBLIC'];
    this.getAllRoles(this.removeRoles);
    this.getOrgDetails();
  }
  initializeFormFields() {
    this.userDetailsForm = new UntypedFormGroup({
      role: new UntypedFormControl(''),
      orgName: new UntypedFormControl('')
    });
  }
  enableAssignRole() {
    this.orgName = []; this.role = [];
    this.showAssignRole = !this.showAssignRole ? true : false;
  }
  editRole(item) {
    this.orgName = []; this.role = [];
    this.orgName.push(item.orgId);
    this.role.push(item.role);
    this.showAssignRole = !this.showAssignRole ? true : false;
    this.isEditRole = true;
  }
  deleteRole(item) {
    this.showDelete = true;
    this.item = item;
  }
  deleteRoleConformed() {
    const item = this.item;
    const roleToDelete = [];
    roleToDelete.push({
      role: item.role,
      operation: 'remove',
      scope: [{
        organisationId: item.orgId
      }]
    });
    const data = { userId: this.userObj.userId, roles: roleToDelete };
    this.updateRoleForUser(data);
    this.dismiss();
  }
  dismiss() {
    this.item = {};
    this.showDelete = false;
  }
  getOrgDetails() {
    if (this.userService && this.userService.userProfile) {
      const userRoles = this.userService.userProfile.userOrgDetails;
      for (const key in userRoles) {
        if (key === 'ORG_ADMIN') {
          this.orgList.push(userRoles[key]);
        }
      }
    }
  }
  dismissRoleAssign() {
    this.showAssignRole = false;
    this.isEditRole = false;
  }
  goBack() {
    this.showingResults = false;
    this.route.navigate(['/manage'], { queryParams: {} });
  }
  getAllRoles(removeRoles) {
    this.permissionService.availableRoles$.subscribe(params => {
      this.allRoles = this.permissionService.allRoles;
      this.allRoles = _.filter(this.allRoles, (role) => {
        return (_.indexOf(removeRoles, role.role) < 0);
      });
    });
  }

  onEnter(key) {
    this.key = key;
    this.showingResults = false;
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
          this.userObj = apiResponse.result.response.content[0];
          this.manipulateUserObject(this.userObj);
        } else {
          this.showNoResult = true;
        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }
  manipulateUserObject(user) {
    this.userAssignedRole = [];
    _.forEach(user.roles, (role) => {
      let userObj = null;
      if (_.findIndex(role.scope, { 'organisationId': this.userService.rootOrgId }) >= 0) {
        // this.removeRoles.push(role.role);
        userObj = {
          role: role.role,
          orgName: this.userService.rootOrgName,
          orgId: this.userService.rootOrgId
        };
        this.rootOrgRoles.push(role.role);
        _.forEach(this.allRoles, (userRole) => {
          if ((userRole.role === role.role)) {
            userObj['roleName'] = userRole.roleName;
          }
        });
        this.userRole.push(userObj);
        this.userAssignedRole.push(role.role);
      }
    });
    // this.getAllRoles(this.removeRoles);
    if (this.userRole.length > 0) {
      this.showCards = true;
    }
  }
  onSubmitForm() {
    this.updateProfile();
    this.enableAssignRole();
  }
  redirect(): void {
    setTimeout(() => {
      this.onEnter(this.key);
    }, 2000);
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
    const newlyAddedRoles = newRoles;
    _.forEach(newlyAddedRoles, (role) => {
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
  enableButton() {
    if (!_.isEmpty(this.userDetailsForm.controls.role.value) && !_.isEmpty(this.userDetailsForm.controls.orgName.value)) {
      this.enableSubmitBtn = true;
    } else {
      this.enableSubmitBtn = false;
    }
  }

}
