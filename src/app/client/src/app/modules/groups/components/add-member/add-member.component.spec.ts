import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { AddMemberComponent, MemberCreationStage } from './add-member.component';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupsService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash-es';
import { of as observableOf, of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { APP_BASE_HREF } from '@angular/common';
import { groupMemberMock } from './add-member.component.spec.data';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;
  let debugElement: DebugElement;
  const fakeActivatedRoute = {
    'params': observableOf({}),
    'queryParams': observableOf({}),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      },
      params: {
        groupId: '123'
      },
      queryParams: {}
    }
  };
  const resourceServiceMockData = {
    messages: {
      smsg: { m0145: 'success'}
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AddMemberComponent],
      providers: [ResourceService, { provide: Router }, TelemetryService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        GroupsService, ToasterService, {provide: APP_BASE_HREF, useValue: '/'} ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    component.ngOnInit();
    expect(component.currentStage).toEqual(MemberCreationStage.START);
  });

  it('should verify user id', () => {
    component.userid = '123';
    component.currentStage = MemberCreationStage.VERIFY_MEMBER;
    component.VerifyMemberUserId();
    expect(component.invalidUserid).toBeFalsy();
    expect(component.currentStage).toEqual(MemberCreationStage.ADD_MEMBER);
  });

  it('should show error if user not available', () => {
    component.currentStage = MemberCreationStage.VERIFY_MEMBER;
    component.userid = '';
    component.VerifyMemberUserId();
    expect(component.invalidUserid).toBeTruthy();
    expect(component.currentStage).toEqual(MemberCreationStage.VERIFY_MEMBER);
  });

  it('should add User to group', async() => {
    const activatedRoute = TestBed.get(ActivatedRoute);
    const groupsService = TestBed.get(GroupsService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceServiceMockData.messages;
    activatedRoute.snapshot.params.groupId = '123';
    spyOn(groupsService, 'addMemberToGroup').and.returnValue(observableOf(groupMemberMock.mockGroupList));
    spyOn(component.memberCreation, 'emit');
    spyOn(toasterService, 'success');
    component.userid = '1';
    component.VerifyMemberUserId();
    component.addUserToGroup();
    expect(toasterService.success).toHaveBeenCalled();
    expect(component.currentStage).toEqual(MemberCreationStage.START);
    expect(component.memberCreation.emit).toHaveBeenCalledWith(groupMemberMock.mockGroupList);
  });


});
