import { impressionObj, fakeActivatedRouteWithGroupId } from './../../services/groups/groups.service.spec.data';
import { TelemetryService } from '@sunbird/telemetry';
import { MY_GROUPS, GROUP_DETAILS, CREATE_GROUP } from './../../interfaces';
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
describe('MyGroupsComponent', () => {
  let component: MyGroupsComponent;
  let fixture: ComponentFixture<MyGroupsComponent>;

  configureTestSuite();

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/my-groups';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      declarations: [ MyGroupsComponent ],
      providers: [ TelemetryService, GroupsService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRouteWithGroupId }, ResourceService,
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
      expect(component.adminGroupsList[0].isAdmin).toBeTruthy();
    });
  });

  it('should throw error when searchUserGroups() is called', () => {
    spyOn(component.groupService, 'searchUserGroups').and.callFake(() => throwError ({}));
    component.getMyGroupList();
    component.groupService.searchUserGroups({filters: {userId: '123'}}).subscribe(data => {}, err => {
      expect(component.adminGroupsList).toEqual([]);
      expect(component.memberGroupsList).toEqual([]);
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
    component.addTelemetry('ftu-popup', '123');
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith('ftu-popup', fakeActivatedRouteWithGroupId.snapshot, [], '123');
  });
});
