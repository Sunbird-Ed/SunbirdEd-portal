import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SearchService, UserService, PermissionService, RolesAndPermissions } from '@sunbird/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
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
  userRole = [];
  removeRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'PUBLIC'];
  userObj: any;
  key: string;
  allRoles: Array<RolesAndPermissions>;
  private searchService: SearchService;
  private toasterService: ToasterService;
  private resourceService: ResourceService;
  private userService: UserService;

  constructor(searchService: SearchService,
    userService: UserService,
    resourceService: ResourceService, private permissionService: PermissionService,
    toasterService: ToasterService, formBuilder: FormBuilder,
    private router: Router) {
    this.searchService = searchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.userService = userService;
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit(): void {
    console.log('testing the component');
    // this.getAllRoles();
  }
  initializeFormFields() {
    this.userDetailsForm = new FormGroup({
      role: new FormControl()
    });
  }
  enableAssignRole() {
    this.showAssignRole = !this.showAssignRole ? true : false;
  }
  dismissRoleAssign() {
    this.showAssignRole = false;
  }
  goBack() {
    this.showingResults = false;
    //this.router.navigate(['/manage']);
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
    this.removeRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'PUBLIC'];
    this.searchService.globalUserSearch(searchParams).subscribe(
      (apiResponse) => {
        if (apiResponse.result.response.count && apiResponse.result.response.content.length > 0) {
          this.showingResults = true;
          this.userObj = apiResponse.result.response.content[0]
          _.forEach(this.userObj.roles, (role) => {
           let userObj = null;
            if (_.findIndex(role.scope, { 'organisationId': this.userService.rootOrgId }) >= 0) {
              this.removeRoles.push(role.role);
              userObj = {
                role: role.role,
                orgName: this.userService.rootOrgName
              }
              this.userRole.push(userObj);
            }
          })
          if (this.userRole.length > 0) {
            this.showCards = true;
          }
        } else {
          this.showNoResult = true
        }
        this.getAllRoles(this.removeRoles);
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }
}
