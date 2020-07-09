import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { AddMemberComponent } from './add-member.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { impressionObj, fakeActivatedRoute, RouterStub, fakeActivatedRouteWithGroupId } from './../../services/groups/groups.service.spec.data';
import { ActivatedRoute } from '@angular/router';

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
    },
    frmelmnts: {
      lbl: {
        you: 'You',
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberComponent ],
      imports: [SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule, FormsModule, TelemetryModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
        {provide: APP_BASE_HREF, useValue: '/'},
        { provide: ActivatedRoute, useValue: fakeActivatedRouteWithGroupId },
        TelemetryService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;

    component.membersList = [{identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false,
    indexOfMember: 1, isCreator: true, name: 'John Doe', userId: '1', role: 'admin'}];

    component.verifiedMember = {identifier: '2', initial: 'T', title: 'Test User', isAdmin: false, isMenu: false,
    indexOfMember: 2, isCreator: false, name: 'Test User', userId: '2', role: 'member'};

    component.groupData = {id: '123', name: 'Test', members: [{userId: '1', role: 'admin', name: 'user'}], createdBy: '1'};

    component.memberId = '2';

    spyOn(component['groupService'], 'getImpressionObject').and.returnValue(impressionObj);
    spyOn(component['groupService'], 'addTelemetry');

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component['groupsService'], 'addFieldsToMember');
    component.ngOnInit();
    expect(component.instance).toEqual('DEV');
    expect(component['groupsService'].addFieldsToMember).toHaveBeenCalled();
    expect(component.telemetryImpression).toEqual(impressionObj);
    expect(component['groupService'].getImpressionObject).toHaveBeenCalled();
  });

  it('should reset values', () => {
    component.reset();
    expect(component.showLoader).toBeFalsy();
    expect(component.isInvalidUser).toBeFalsy();
    expect(component.isVerifiedUser).toBeFalsy();
  });

  it('should reset form values', () => {
    component.resetValue();
    expect(component.memberId).toEqual('');
    expect(component.showLoader).toBeFalsy();
    expect(component.isInvalidUser).toBeFalsy();
    expect(component.isVerifiedUser).toBeFalsy();
  });

  it('should return is member is already present', () => {
    spyOn(component, 'isExistingMember').and.returnValue(true);
    component.verifyMember();
    expect(component.isExistingMember).toHaveBeenCalled();
  });

  it('should return is member is not already present', () => {
    spyOn(component['userService'], 'getUserData').and.returnValue(of ({result: {response: {identifier: '2', name: 'user 2'}}}));
    spyOn(component, 'isExistingMember').and.returnValue(false);
    component.verifyMember();
    expect(component.isExistingMember).toHaveBeenCalled();
    expect(component['userService'].getUserData).toHaveBeenCalledWith('2');
  });

  it('should throw error', () => {
    component.memberId = '1';
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'resetValue');
    const value = component.isExistingMember();
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m007);
    expect(value).toBeTruthy();
    expect(component.resetValue).toHaveBeenCalled();
  });

  it('should not throw error', () => {
    const value = component.isExistingMember();
    expect(value).toBeFalsy();
  });

  it('should get getGroupById()', () => {
    const response = {id: '123', name: 'Test', members:
    [{userId: '2', role: 'member', name: 'user'}, {userId: '1', role: 'admin', name: 'user 2'}]};
    spyOn(component['groupsService'], 'addFieldsToMember').and.returnValue([response]);
    spyOn(component['groupsService'], 'getGroupById').and.returnValue(of (response));
    component.getUpdatedGroupData();
    component['groupsService'].getGroupById('123', true).subscribe(data => {
      expect(component['groupsService'].addFieldsToMember).toHaveBeenCalled();
    });
    });

  it('should  add member to group', () => {
    component.membersList = [];
    spyOn(component, 'isExistingMember').and.returnValue(false);
    spyOn(component['groupsService'], 'addMemberById').and.returnValue(of ({}));
    spyOn(component['toasterService'], 'success');
    component.addMemberToGroup();
    expect(component.isExistingMember).toHaveBeenCalled();
    component['groupsService'].addMemberById('123', {members: [{userId: '2', role: 'member'}]}).subscribe(data => {
    expect(component['toasterService'].success).toHaveBeenCalledWith('Test User added to group successfully');
    });
  });

  it('should throw error while adding member to group id there is error {}', () => {
    component.membersList = [];
    spyOn(component['groupsService'], 'addMemberById').and.returnValue(of ({errors: ['2']}));
    spyOn(component, 'showErrorMsg');
    component.addMemberToGroup();
    component['groupsService'].addMemberById('123', {members: [{userId: '2', role: 'member'}]}).subscribe(data => {
      expect(data).toEqual({errors: ['2']});
      expect(component.showErrorMsg).toHaveBeenCalledWith(data);
    });
  });

  it('should throw error while adding member to group', () => {
    component.membersList = [];
    spyOn(component['groupsService'], 'addMemberById').and.returnValue(throwError ({}));
    spyOn(component, 'showErrorMsg');
    component.addMemberToGroup();
    component['groupsService'].addMemberById('123', {members: [{userId: '2', role: 'member'}]}).subscribe(data => {}, err => {
      expect(component.showErrorMsg).toHaveBeenCalled();
    });
  });



  it('should call addTelemetry', () => {
    component.addTelemetry('ftu-popup');
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith('ftu-popup', fakeActivatedRouteWithGroupId.snapshot);
  });

});
