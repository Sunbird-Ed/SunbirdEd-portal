import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGroupsComponent } from './my-groups.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, inject } from '@angular/core';
import * as _ from 'lodash-es';
import { CoreModule } from '@sunbird/core';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { GroupsService } from '../../services';
import { of as observableOf, of } from 'rxjs';
import { mygroupsMockData } from './my-groups.component.spec.data';

describe('MyGroupsComponent', () => {
  let component: MyGroupsComponent;
  let fixture: ComponentFixture<MyGroupsComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({}),
    snapshot: {
        data: {
            telemetry: {
                env: 'groups', pageid: 'gropus-list', type: 'view', object: { type: 'groups', ver: '1.0' }
            }
        }
    }
  };
  class RouterStub {
      navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      declarations: [ MyGroupsComponent ],
      providers: [ GroupsService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, ResourceService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroupsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all the groups list', () => {
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'getAllGroups').and.callFake(() => observableOf(mygroupsMockData.mockGroupList[0]));
    component.ngOnInit();
    component.getMyGroupList();
    expect(component.groupList.length).toEqual(0);
  });

  it('should show create group modal', () => {
    component.showCreateFormModal();
    expect(component.showGroupCreateForm).toBeTruthy();
  });

  it('should update group list when create group form submit', () => {
    component.updateGroupList(mygroupsMockData.mockGroupList[0]);
    expect(component.groupList.length).toEqual(1);
  });

  it('should navigate to group detail page', () => {
    const groupid = mygroupsMockData.mockGroupList[0].identifier;
    const router = TestBed.get(Router);
    component.navigateToDetailPage(groupid);
    expect(router.navigate).toHaveBeenCalledWith(['groups/view', groupid]);
  });

});
