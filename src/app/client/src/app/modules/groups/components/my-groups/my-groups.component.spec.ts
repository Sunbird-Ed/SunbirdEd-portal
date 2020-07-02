import { MY_GROUPS, GROUP_DETAILS, CREATE_GROUP } from './../routerLinks';
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
import { configureTestSuite } from '@sunbird/test-util';
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
  configureTestSuite();
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

  it('should call getMyGroupList', () => {
    spyOn(component, 'getMyGroupList');
    component.ngOnInit();
    expect(component.getMyGroupList).toHaveBeenCalled();
  });

  it('should call getAllGroups list', () => {
    spyOn(component.groupService, 'getAllGroups').and.callFake(() => observableOf(mygroupsMockData.mockGroupList[0]));
    component.getMyGroupList();
    expect(component.groupService.getAllGroups).toHaveBeenCalled();
  });

  it('should show create group modal', () => {
    component.showCreateFormModal();
    expect(component.router.navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${CREATE_GROUP}`]);
  });

  it('should navigate to group detail page', () => {
    const router = TestBed.get(Router);
    component.navigateToDetailPage({data: {identifier: '123'}});
    expect(router.navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`, '123']);
  });

});
