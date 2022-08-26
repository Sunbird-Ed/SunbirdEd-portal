import { SearchService, UserService, PermissionService } from "@sunbird/core";
import { ToasterService, ResourceService } from "@sunbird/shared";
import { Router } from "@angular/router";
import { ManageService } from "../../services/manage/manage.service";
import { FormBuilder } from "@angular/forms";
import { UserRoleAssignComponent } from "./user-role-assign.component";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { setTimeout } from "timers";

describe("UserRoleAssign component", () => {
  let userRoleAssignComponent: UserRoleAssignComponent;
  const responseData={
    result:{
      response:{
        count:1,
        content:[{roles:'test'}]
      }
    }
  }
  const mockSearchService: Partial<SearchService> = {
    globalUserSearch:jest.fn().mockReturnValue(of(responseData)) as any,
  };
  const mockUserService: Partial<UserService> = {
    userProfile: {userOrgDetails:{ORG_ADMIN:'admin1'}},
    rootOrgId:'1',
    rootOrgName:'test'
  };
  const mockResourceService: Partial<ResourceService> = {
    messages:{
      smsg:{
        m0049:'success'
      },
      emsg:{
        m0020:'error1',
        m0005:'error2'
      }
    }
  };
  const mockPermissionService: Partial<PermissionService> = {
    availableRoles$: of(true) as any,
    allRoles: ['admin'] as any,
  };
  const mockToasterService: Partial<ToasterService> = {
    success:jest.fn(),
    error:jest.fn()
  };
  const mockFormBuilder: Partial<FormBuilder> = {};
  const mockRoute: Partial<Router> = {};
  const mockManageService: Partial<ManageService> = {
    updateRoles:jest.fn().mockReturnValue(of(true)) as any,
  };
  const removeRolesData = [
    "ORG_ADMIN",
    "SYSTEM_ADMINISTRATION",
    "ADMIN",
    "PUBLIC",
  ];

  beforeAll(() => {
    userRoleAssignComponent = new UserRoleAssignComponent(
      mockSearchService as SearchService,
      mockUserService as UserService,
      mockResourceService as ResourceService,
      mockPermissionService as PermissionService,
      mockToasterService as ToasterService,
      mockFormBuilder as FormBuilder,
      mockRoute as Router,
      mockManageService as ManageService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of userRoleAssign component and set userDetailsForm", () => {
    expect(userRoleAssignComponent).toBeTruthy();
    expect(userRoleAssignComponent.userDetailsForm).toBeDefined();
  });

  describe("ngOnInit", () => {
    it("should set instance and removeRoles properties", () => {
      userRoleAssignComponent.ngOnInit();
      expect(userRoleAssignComponent.instance).toBeDefined();
      expect(userRoleAssignComponent.removeRoles).toBeDefined();
      expect(userRoleAssignComponent.removeRoles).toEqual(removeRolesData);
    });

    it("should call getAllRoles and getOrgDetails", () => {
      jest.spyOn(userRoleAssignComponent, "getAllRoles");
      jest.spyOn(userRoleAssignComponent, "getOrgDetails");
      userRoleAssignComponent.ngOnInit();
      expect(userRoleAssignComponent.getAllRoles).toBeCalledWith(removeRolesData);
      expect(userRoleAssignComponent.getOrgDetails).toBeCalled();
    });
  });

  it('should set allRoles on getAllRoles call',()=>{
    userRoleAssignComponent.getAllRoles(removeRolesData);
    //@ts-ignore
    expect(userRoleAssignComponent.allRoles).toBeDefined();
  });

  it('should set the orgList if both userService and userProfile are true',()=>{
    userRoleAssignComponent.orgList=[];
    userRoleAssignComponent.getOrgDetails();
    expect(userRoleAssignComponent.orgList).toEqual(['admin1']);
  });

  it('should not set the orgList if either userService or userProfile is false',()=>{
    //@ts-ignore
    mockUserService.userProfile=false
    userRoleAssignComponent.orgList=[];
    userRoleAssignComponent.getOrgDetails();
    expect(userRoleAssignComponent.orgList).toEqual([]);
  });

  it('should enable assign role', ()=> {
    userRoleAssignComponent.enableAssignRole();
    expect(userRoleAssignComponent.showAssignRole).toEqual(true);
    userRoleAssignComponent.enableAssignRole();
    expect(userRoleAssignComponent.showAssignRole).toEqual(false);
  });

  it('should edit role', ()=> {
    const item={orgId:'test',role:'student'};
    userRoleAssignComponent.editRole(item);
    expect(userRoleAssignComponent.orgName).toBeDefined();
    expect(userRoleAssignComponent.role).toBeDefined();
    expect(userRoleAssignComponent.orgName).toEqual(['test']);
    expect(userRoleAssignComponent.role).toEqual(['student']);
    expect(userRoleAssignComponent.showAssignRole).toEqual(true);
    expect(userRoleAssignComponent.isEditRole).toEqual(true);
  });

  it('should delete role', ()=> {
    const item={orgId:'test',role:'student'};
    userRoleAssignComponent.deleteRole(item);
    expect(userRoleAssignComponent.showDelete).toEqual(true);
    expect(userRoleAssignComponent.item).toEqual(item);
  });

  it('should delete role conformed', ()=> {
    userRoleAssignComponent.userObj={userId:'test'};
    const roleToDelete=[{
      role: 'student',
      operation: 'remove',
      scope: [{
        organisationId: 'test'
      }]
    }];
    const response= { userId: 'test', roles: roleToDelete };
    jest.spyOn(userRoleAssignComponent,'updateRoleForUser');
    jest.spyOn(userRoleAssignComponent,'dismiss');
    userRoleAssignComponent.deleteRoleConformed();
    expect(userRoleAssignComponent.updateRoleForUser).toHaveBeenCalledWith(response);
    expect(userRoleAssignComponent.dismiss).toHaveBeenCalled();
  });

  it('should set showDelete and item to false and empty respectively on dismiss call', ()=> {
    userRoleAssignComponent.dismiss();
    expect(userRoleAssignComponent.showDelete).toEqual(false);
    expect(userRoleAssignComponent.item).toEqual({});
  });

  it('should update role for user', ()=> {
    const data='test';
    //@ts-ignore
    jest.spyOn(userRoleAssignComponent.toasterService,'success');
    jest.spyOn(userRoleAssignComponent,'redirect');
    jest.spyOn(userRoleAssignComponent,'initializeFormFields');
    userRoleAssignComponent.updateRoleForUser(data);
    expect(userRoleAssignComponent['toasterService'].success).toBeCalledWith('success');
    expect(userRoleAssignComponent.redirect).toBeCalled();
    expect(userRoleAssignComponent.initializeFormFields).toBeCalled();
  });

  it('should not update role for user in case of thrown error', ()=> {
    const data='test';
    const errorResponse: HttpErrorResponse = {status: 401} as HttpErrorResponse;
    mockManageService.updateRoles = jest.fn().mockReturnValue(throwError(errorResponse));
    //@ts-ignore
    jest.spyOn(userRoleAssignComponent.toasterService,'error');
    jest.spyOn(userRoleAssignComponent,'redirect');
    userRoleAssignComponent.updateRoleForUser(data);
    expect(userRoleAssignComponent['toasterService'].error).toBeCalledWith('error1');
    expect(userRoleAssignComponent.redirect).toBeCalled();
  });

  it('should redirect', (done)=> {
    jest.spyOn(userRoleAssignComponent,'onEnter');
    userRoleAssignComponent.redirect();
    setTimeout(()=>{
      expect(userRoleAssignComponent.onEnter).toBeCalled();
      done();
    },2000)
  });

  describe('onEnter', ()=> {
    it('should set showingResults true  and set userObj after Observable firing', ()=> {
      const data={roles:'test'};
      jest.spyOn(userRoleAssignComponent,'manipulateUserObject');
      userRoleAssignComponent.onEnter('test');
      expect(userRoleAssignComponent.showingResults).toEqual(true)
      expect(userRoleAssignComponent.userObj).toEqual(data);
      expect(userRoleAssignComponent.manipulateUserObject).toHaveBeenCalledWith(data)
    });

    it('should set showNoResult if either response count or content length false', ()=> {
      responseData.result.response.count=0
      userRoleAssignComponent.onEnter('test');
      expect(userRoleAssignComponent.showNoResult).toEqual(true);
    });

    it('should handle error showNoResult in case of thrown error', ()=> {
      const errorResponse: HttpErrorResponse = {status: 401} as HttpErrorResponse;
      mockSearchService.globalUserSearch = jest.fn().mockReturnValue(throwError(errorResponse));
      //@ts-ignore
      jest.spyOn(userRoleAssignComponent.toasterService,'error');
      userRoleAssignComponent.onEnter('test');
      expect(userRoleAssignComponent['toasterService'].error).toBeCalledWith('error2');
    });
  })
});
