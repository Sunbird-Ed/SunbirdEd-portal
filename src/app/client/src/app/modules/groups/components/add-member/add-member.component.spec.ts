import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { AddMemberComponent } from './add-member.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;
  configureTestSuite();
  const resourceBundle = {
    instance: 'DEV',
    messages: {
      emsg: {
        m007: 'Member is already existing',
        m006: 'Unable to add {name} to group',
      },
      smsg: {
        m004: '{memberName} added to group successfully'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberComponent ],
      imports: [SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule, FormsModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // {userId: '2', name: 'user 2',
    // title: 'user 2', initial: 'u', identifier: '2', isAdmin: false, isCreator: false}
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'addFieldsToMember');
    component.ngOnInit();
    expect(component.instance).toEqual('DEV');
    expect(component.addFieldsToMember).toHaveBeenCalled();
  });

  it('should call addFields()', () => {
    spyOn(component['groupsService'], 'emitMembers');
    component.addFieldsToMember();
    expect(component['groupsService'].emitMembers).toHaveBeenCalled();
  });

  it ('should return member', () => {
    component.groupData = {name: 'Test', members: [{userId: '1', role: 'admin', name: 'user'}], createdBy: '1'};
    const data = component.addFields({userId: '1', role: 'admin', name: 'user'});
    expect(data.userId).toEqual('1');
    expect(data.title).toEqual('user');
    expect(data.initial).toEqual('u');
  });

  it ('should reset values', () => {
    component.reset();
    expect(component.showLoader).toBeFalsy();
    expect(component.isInvalidUser).toBeFalsy();
    expect(component.isVerifiedUser).toBeFalsy();
  });

  it ('should reset form values', () => {
    component.resetValue();
    expect(component.memberId).toEqual('');
    expect(component.showLoader).toBeFalsy();
    expect(component.isInvalidUser).toBeFalsy();
    expect(component.isVerifiedUser).toBeFalsy();
  });

  it ('should return is member is already present', () => {
    component.memberId = '2';
    component.membersList = [{userId: '1', name: 'user'}];
    spyOn(component, 'isExistingMember').and.returnValue(true);
    component.verifyMember();
    expect(component.isExistingMember).toHaveBeenCalled();
  });

  it ('should return is member is not already present', () => {
    component.groupData = {name: 'Test', members: [{userId: '1', role: 'admin', name: 'user'}], createdBy: '1'};
    component.memberId = '2';
    component.membersList = [{userId: '1', name: 'user'}];
    spyOn(component, 'addFields');
    spyOn(component['userService'], 'getUserData').and.returnValue(of ({result: {response: {identifier: '2', name: 'user 2'}}}));
    spyOn(component, 'isExistingMember').and.returnValue(false);
    component.verifyMember();
    expect(component.isExistingMember).toHaveBeenCalled();
    expect(component.addFields).toHaveBeenCalledTimes(1);
    expect(component['userService'].getUserData).toHaveBeenCalledWith('2');
  });

  it ('should throw error', () => {
    component.memberId = '1';
    component.membersList = [{userId: '1', name: 'user'}];
    spyOn(component['toasterService'], 'error');
    const value = component.isExistingMember();
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m007);
    expect(value).toBeTruthy();
  });

  it ('should not throw error', () => {
    component.memberId = '2';
    component.membersList = [{userId: '1', name: 'user'}];
    const value = component.isExistingMember();
    expect(value).toBeFalsy();
  });

  it ('should  add member to group', () => {
    component.memberId = '2';
    component.verifiedMember = {title: 'user 2'};
    component.groupData = {id: '123'};
    spyOn(component['groupsService'], 'addMemberById').and.returnValue(of ({}));
    spyOn(component['toasterService'], 'success');
    component.addMemberToGroup();
    expect(component['groupsService'].addMemberById).toHaveBeenCalledWith('123', [{userId: '2', role: 'member'}]);
    expect(component['toasterService'].success).toHaveBeenCalledWith('user 2 added to group successfully');
  });

  it ('should throw error while adding member to group', () => {
    component.memberId = '2';
    component.verifiedMember = {title: 'user 2'};
    component.groupData = {id: '123'};
    spyOn(component['groupsService'], 'addMemberById').and.returnValue(of ({errors: ['2']}));
    spyOn(component['toasterService'], 'error');
    component.addMemberToGroup();
    expect(component['groupsService'].addMemberById).toHaveBeenCalledWith('123', [{userId: '2', role: 'member'}]);
    component['groupsService'].addMemberById('123', [{userId: '2', role: 'member'}]).subscribe(data => {
      expect(data).toEqual({errors: ['2']});
      expect(component['toasterService'].error).toHaveBeenCalledWith('Unable to add 2 to group');
    });
  });

  it ('should get getGroupById()', () => {
    component.memberId = '2';
    component.groupData = {id: '123'};
    spyOn(component['groupsService'], 'getGroupById').and.returnValue(of ({id: '123', name: 'Test',
    members: [{userId: '2', role: 'member', name: 'user'}, {userId: '1', role: 'admin', name: 'user 2'}]}));
    component.getUpdatedGroupData();
    expect(component['groupsService'].getGroupById).toHaveBeenCalledWith('123', true);
  });

});
