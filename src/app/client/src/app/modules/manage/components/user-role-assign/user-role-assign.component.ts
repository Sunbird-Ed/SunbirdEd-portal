import { Component, OnInit } from '@angular/core';
import { SearchService, UserService } from '@sunbird/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-user-role-assign',
  templateUrl: './user-role-assign.component.html',
  styleUrls: ['./user-role-assign.component.scss']
})
export class UserRoleAssignComponent implements OnInit {
  showingResults = false;
  showCards = false;
  showAssignRole=false;
  userRole = [];
  userObj:any;
  key: string;
  private searchService: SearchService;
  private toasterService: ToasterService;
  private resourceService: ResourceService;
  private userService: UserService;

  constructor(searchService: SearchService, userService: UserService, resourceService: ResourceService, toasterService: ToasterService) {
    this.searchService = searchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.userService = userService;
   }

  ngOnInit(): void {
    console.log('testing the component');
  }
  enableAssignRole() {
    this.showAssignRole = !this.showAssignRole?true:false;
  }

  onEnter(key) {
    this.key = key;
    console.log('key value is ---->',this.key);
    const searchParams = {
      filters: {
        userName:this.key
      }
    };

    this.searchService.globalUserSearch(searchParams).subscribe(
      (apiResponse) => {
        if (apiResponse.result.response.count && apiResponse.result.response.content.length > 0) {
          this.showingResults = true;
          this.userObj = apiResponse.result.response.content[0]
          _.forEach(this.userObj.roles, (role) =>{
            console.log('---->', role);
            let userObj = null;
            if(_.findIndex(role.scope, {'organisationId':this.userService.rootOrgId}) >= 0){
              userObj={
                role:role.role
              }
              this.userRole.push(userObj);
            }
          })
          if(this.userRole.length > 0){
            this.showCards = true;
          }
        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }
}
