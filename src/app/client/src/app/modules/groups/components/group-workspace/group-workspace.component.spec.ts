import { groupMockData } from './group-workspace.component.spec.data';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWorkspaceComponent } from './group-workspace.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupsService } from '../../services';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

describe('GroupWorkspaceComponent', () => {
  let component: GroupWorkspaceComponent;
  let fixture: ComponentFixture<GroupWorkspaceComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        groupId: 'do_1130152710033489921159'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWorkspaceComponent ],
      imports: [ReactiveFormsModule, FormsModule, SharedModule.forRoot(), HttpClientModule, RouterTestingModule],
      providers: [ GroupsService,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: Router, useClass: RouterStub},
        {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should call getGroupDatEa', () => {
    spyOn(component, 'getGroupData');
    component.ngOnInit();
    expect(component.getGroupData).toHaveBeenCalled();
    expect(component['groupId']).toEqual('do_1130152710033489921159');
  });

  it('membersList should be empty []', () => {
    component.memberQuery = 'cif';
    component['_membersList'] = [];
    component.searchMembers();
    expect(component.membersList).toEqual([]);
    expect(component.noResultMsg).toEqual('No member found');
  });

  it('membersList should NOT be empty []', () => {
    component.memberQuery = 'abc';
    component['_membersList'] = groupMockData.membersList;
    component.searchMembers();
    expect(component.membersList.length).toEqual(1);
    expect((component.membersList[0]['title']).toLowerCase()).toContain('abc');
    expect(component.noResultMsg).toEqual('');
  });

  it ('handleMember should call getHandledMember()', () => {
    spyOn(component, 'getHandledMember').and.callFake(() => {
      component.pastMembersList.push(groupMockData.membersList[1]);
      return [groupMockData.membersList[0], groupMockData.membersList[2]];
    });
    component.membersList = groupMockData.membersList;
    expect(component.membersList.length).toEqual(3);
    component.handleMember({data: {identifier: '2', modalName: 'Remove'}});
    fixture.detectChanges();
    expect(component.membersList.length).toEqual(2);
    expect(component.getHandledMember).toHaveBeenCalledWith(false, '2', true);
    expect(component.pastMembersList).toContain(groupMockData.membersList[1]);
  });

  it ('should make isAdmin FALSE for the selected user ', () => {
    spyOn(component, 'getHandledMember').and.callFake(() => {
      component.membersList = groupMockData.modifiedMemberList;
    });
    component.membersList = groupMockData.membersList;
    expect(component.membersList[0]['isAdmin']).toBeTruthy();
    component.handleMember({data: {identifier: '1', modalName: 'Dismiss'}});
    expect(component.getHandledMember).toHaveBeenCalledWith(false, '1');
    expect(component.membersList[0]['isAdmin']).toBeFalsy();
  });

  it ('should make isAdmin TRUE for the selected user', () => {
    spyOn(component, 'getHandledMember').and.callFake(() => {
      component.membersList = groupMockData.modifiedMemberList;
    });
    component.membersList = groupMockData.membersList;
    expect(component.membersList[1]['isAdmin']).toBeUndefined();
    component.handleMember({data: {identifier: '2', modalName: 'Promote'}});
    expect(component.getHandledMember).toHaveBeenCalledWith(true, '2');
    expect(component.membersList[1]['isAdmin']).toBeTruthy();
  });

  it ('should return data after removing Member from list ', () => {
    component.membersList = groupMockData.membersList;
    const data = component.getHandledMember(true, '2', true);
    expect(data).toEqual([groupMockData.membersList[0], groupMockData.membersList[2]]);
    expect(component.pastMembersList).toContain(groupMockData.membersList[1]);
  });

  it ('should return data after making isAdmin TRUE  ', () => {
    component.membersList = groupMockData.membersList;
    const data = component.getHandledMember(true, '2');
    expect(data).toEqual([groupMockData.membersList[0], groupMockData.membersList[2]]);
  });

  it ('should return data after making isAdmin FALSE  ', () => {
    component.membersList = groupMockData.membersList;
    const data = component.getHandledMember(true, '2');
    expect(data).toEqual([groupMockData.membersList[0], groupMockData.membersList[2]]);
  });
});
