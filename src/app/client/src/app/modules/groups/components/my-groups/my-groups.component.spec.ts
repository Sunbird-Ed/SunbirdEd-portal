import { impressionObj, fakeActivatedRouteWithGroupId } from './../../services/groups/groups.service.spec.data';
import { TelemetryService } from '@sunbird/telemetry';
import { MY_GROUPS, GROUP_DETAILS, CREATE_GROUP, acceptTnc } from './../../interfaces';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGroupsComponent } from './my-groups.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash-es';
import { CoreModule } from '@sunbird/core';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { GroupsService } from '../../services';
import { of, throwError } from 'rxjs';
import { mockGroupList } from './my-groups.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
import { APP_BASE_HREF } from '@angular/common';
import { GroupEntityStatus, GroupMembershipType } from '@project-sunbird/client-services/models';
describe('MyGroupsComponent', () => {
  let component: MyGroupsComponent;
  let fixture: ComponentFixture<MyGroupsComponent>;

  configureTestSuite();

  const resourceBundle = {
    frmelmnts: {
      msg: {
        guidelinesacceptsuccess: '',
        guidelinesacceptfailed: ''
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/my-groups';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      declarations: [ MyGroupsComponent ],
      providers: [ TelemetryService, GroupsService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRouteWithGroupId },
        { provide: ResourceService, useValue: resourceBundle},
        { provide: APP_BASE_HREF, useValue: '/' } ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component['userService']['_userid'] = '123';
    spyOn(component['groupService'], 'getImpressionObject').and.returnValue(impressionObj);
    spyOn(component['groupService'], 'addTelemetry');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMyGroupList', () => {
    spyOn(component, 'getMyGroupList');
    component.ngOnInit();
    expect(component.getMyGroupList).toHaveBeenCalled();
  });

  it('should call searchUserGroups', () => {
    spyOn(component.groupService, 'searchUserGroups').and.callFake(() => of (mockGroupList));
    component.getMyGroupList();
    component.groupService.searchUserGroups({filters: {userId: '123'}}).subscribe(data => {
      expect(component.groupsList[0].isAdmin).toBeTruthy();
    });
  });

  it('should throw error when searchUserGroups() is called', () => {
    spyOn(component.groupService, 'searchUserGroups').and.callFake(() => throwError ({}));
    component.getMyGroupList();
    component.groupService.searchUserGroups({filters: {userId: '123'}}).subscribe(data => {}, err => {
      expect(component.groupsList).toEqual([]);
    });
  });

  it('should show create group modal', () => {
    component.showCreateFormModal();
    expect(component.router.navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${CREATE_GROUP}`]);
  });

  it('should navigate to group detail page', () => {
    const router = TestBed.get(Router);
    component.navigateToDetailPage({data: {id: '123'}});
    expect(router.navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`, '123']);
    expect(component.selectedType).toEqual(acceptTnc.GROUP);
    expect(component.showTncModal).toBe(false);
  });

  it('should Not navigate to group detail page', () => {
    const router = TestBed.get(Router);
    component.navigateToDetailPage({data: {id: '123', visited: false}});
    expect(router.navigate).not.toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`, '123']);
    expect(component.selectedType).toEqual(acceptTnc.GROUP);
    expect(component.showTncModal).toBe(true);
  });

  it('should close closeModal', () => {
    component.closeModal();
    expect(component.showModal).toBeFalsy();
  });

  it('should get impressionObject', () => {
    component.ngOnInit();
    expect(component.telemetryImpression).toEqual(impressionObj);
    expect(component['groupService'].getImpressionObject).toHaveBeenCalled();
  });

  it('should call addTelemetry', () => {
    component.groupsList.push({
    id: '137cabc7-79b6-495e-b987-b0c87c317e91',
    name: 'group',
    description: 'test',
    membershipType: GroupMembershipType.INVITE_ONLY,
    status: GroupEntityStatus.ACTIVE,
    active: true,
    isActive() { return true ;}
    });
    component.addTelemetry('ftu-popup', '137cabc7-79b6-495e-b987-b0c87c317e91');
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith({id: 'ftu-popup',
    extra: {status: 'active'}}, fakeActivatedRouteWithGroupId.snapshot,
    [], '137cabc7-79b6-495e-b987-b0c87c317e91', {id: '137cabc7-79b6-495e-b987-b0c87c317e91', type: 'group', ver: '1.0'});
  });

  it('should call acceptAllGroupsTnc', () => {
    spyOn(component, 'acceptAllGroupsTnc');
    component.handleGroupTnc({type: acceptTnc.ALL});
    expect(component.acceptAllGroupsTnc).toHaveBeenCalled();
  });

  it('should call acceptGroupTnc', () => {
    spyOn(component, 'acceptGroupTnc');
    component.handleGroupTnc({type: acceptTnc.GROUP});
    expect(component.acceptGroupTnc).toHaveBeenCalledWith();
  });

  it('should disable showTncModal', () => {
    component.handleGroupTnc();
    expect(component.showTncModal).toBeFalsy();
  });

  it('should call updateGroupGuidelines', () => {
    component.selectedGroup = {id: '1'};
    const request = {
      userId: '123',
      groups: [
        {
          groupId: '1',
          visited: true
        }
      ]
    };
    spyOn(component, 'navigate');
    spyOn(component['groupService'], 'updateGroupGuidelines').and.returnValue(of ({}));
    spyOnProperty(component['userService'], 'userid').and.returnValue('123');
    component.acceptGroupTnc();
    expect(component.showTncModal).toBeFalsy();
    expect(component['groupService'].updateGroupGuidelines).toHaveBeenCalledWith(request);
    component['groupService'].updateGroupGuidelines(request).subscribe(data => {
      expect(component.navigate).toHaveBeenCalledWith({data: {id: '1'}});
    });
  });

  it('should call acceptTermsAndConditions', () => {
    component.latestTnc = {field: 'groups', value: {latestVersion: 'V1'}};
    spyOn(component, 'navigate');
    spyOn(component['userService'], 'acceptTermsAndConditions').and.returnValue(of ({}));
    spyOnProperty(component['userService'], 'userid').and.returnValue('123');
    const requestBody = {
      request: {
        tncType: 'groups',
        version:  'V1',
        userId:  '123'
      }
    };
    component.acceptAllGroupsTnc();

    component['userService'].acceptTermsAndConditions(requestBody).subscribe(data => {
      expect(component.showTncModal).toBeFalsy();
    });

  });


});
