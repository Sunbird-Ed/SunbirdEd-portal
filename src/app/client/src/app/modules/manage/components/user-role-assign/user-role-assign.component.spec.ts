import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserRoleAssignComponent } from './user-role-assign.component';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CoreModule, UserService,  PermissionService, SearchService,ObservationUtilService} from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService, ResourceService, BrowserCacheTtlService, ToasterService, SharedModule } from '@sunbird/shared';
import { mockObject } from './user-role-assign.spec.data';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';


describe('UserRoleAssignComponent', () => {
  configureTestSuite();
  let component: UserRoleAssignComponent;
  let fixture: ComponentFixture<UserRoleAssignComponent>;
  let observationUtilService;
  
  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      imports: [SuiModule, CoreModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]), TranslateModule.forRoot(), SharedModule.forRoot()],
      declarations: [ UserRoleAssignComponent ],
      providers: [TelemetryService, ObservationUtilService, ConfigService, ResourceService,
        BrowserCacheTtlService,ToasterService, UserService, PermissionService, SearchService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleAssignComponent);
    observationUtilService=TestBed.get(ObservationUtilService)
    component = fixture.componentInstance;
    fixture.detectChanges();
    const userService = TestBed.get(UserService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call deleteRole method', () => {
    const item = mockObject.MockItem;
    component.userObj = mockObject.userObj;
    spyOn(component, 'deleteRole').and.callThrough();
    component.deleteRole(item);
    expect(component.deleteRole).toHaveBeenCalledWith(item);
  });
  
  it('should call enableAssignRole method', () => {
    spyOn(component, 'enableAssignRole').and.callThrough();
    component.enableAssignRole();
    expect(component.enableAssignRole).toHaveBeenCalled();
    expect(component.showAssignRole).toBeTruthy();
    component.showAssignRole = true
    component.enableAssignRole();
    expect(component.showAssignRole).toBeFalsy();
  });
  it('should call editRole method', () => {
    spyOn(component, 'editRole').and.callThrough();
    const item = mockObject.MockItem;
    component.editRole(item);
    expect(component.editRole).toHaveBeenCalledWith(item);
    expect(component.showAssignRole).toBeTruthy();
    component.showAssignRole = true
    component.editRole(item);
    expect(component.showAssignRole).toBeFalsy();
  });

  it('should call dismissRoleAssign and goBack method', () => {
    component.dismissRoleAssign();
    expect(component.showAssignRole).toBeFalsy();
    component.goBack();
    expect(component.showingResults).toBeFalsy();
  });
  it('should call getOrgDetails method', () => {
      const userService = TestBed.get(UserService);
      userService._userProfile = mockObject.userMockData;
    spyOn(component, 'getOrgDetails').and.callThrough();
    component.getOrgDetails();
    expect(component.getOrgDetails).toHaveBeenCalled();
  });
  it('should call getAllRoles to get all the roles', () => {
    const removeRole = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION', 'ADMIN', 'PUBLIC']
    const getAllRolesSpy = spyOn(component, 'getAllRoles');
    const permissionService = TestBed.get(PermissionService);
    component.getAllRoles(removeRole);
    expect(getAllRolesSpy).toHaveBeenCalled();
    expect(getAllRolesSpy).toHaveBeenCalledTimes(1);
  });
  it('should call onEnter ', () => {
    const key ='rajtest11936'
    const searchService = TestBed.get(SearchService);
    spyOn(component, 'onEnter').and.callThrough();
    component.onEnter(key);
    spyOn(searchService, 'globalUserSearch').and.returnValue(observableOf(mockObject.userSearch));
    expect(component.onEnter).toHaveBeenCalled();
  });

  it('should call manipulateUserObject ', () => {
    const roleList = ['BOOK_REVIEWER'];
    const objectToGetCreated = [{
      'role':'BOOK_REVIEWER',
      'orgName': 'tamilnadu',
      'orgId': '01269878797503692810',
      'roleName': 'Book Reviewer'
    }]
    component.allRoles = mockObject.roleList; 
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockObject.userMockData });
    userService._rootOrgId = '01269878797503692810';
    userService.rootOrgName = 'tamilnadu';
    spyOn(component, 'manipulateUserObject').and.callThrough();
    component.manipulateUserObject(mockObject.userObj);
    expect(component.manipulateUserObject).toHaveBeenCalled();
    expect(component.rootOrgRoles).toEqual(roleList);
    expect(component.userRole).toEqual(objectToGetCreated);
    expect(component.userAssignedRole).toEqual(roleList);
    expect(component.showCards).toBeTruthy();
  });
  it('should call onSubmitForm ', () => {
    component.userDetailsForm.controls['role'].setValue('PUBLIC');
    component.userDetailsForm.controls['orgName'].setValue('tamilnadu');
    component.userObj = mockObject.userObj;
    spyOn(component, 'onSubmitForm').and.callThrough();
    spyOn(component, 'updateProfile').and.callThrough();
    spyOn(component, 'enableAssignRole').and.callThrough();
    component.onSubmitForm();
    expect(component.onSubmitForm).toHaveBeenCalled();
    expect(component.updateProfile).toHaveBeenCalled();
    expect(component.enableAssignRole).toHaveBeenCalled();
  });
});