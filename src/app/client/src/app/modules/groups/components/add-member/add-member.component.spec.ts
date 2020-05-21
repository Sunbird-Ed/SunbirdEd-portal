import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { AddMemberComponent } from './add-member.component';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupsService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
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

  it('should verify user id', () => {
    component.userid = '123';
    component.memberCreationStep++;
    component.VerifyMemberUserId();
    expect(component.invalidUserid).toBeFalsy();
    expect(component.memberCreationStep).toEqual(3);
  });

  it('should show error if user not available', () => {
    component.memberCreationStep++;
    component.userid = '';
    component.VerifyMemberUserId();
    expect(component.invalidUserid).toBeTruthy();
    expect(component.memberCreationStep).toEqual(2);
  });

  it('should add User to group', () => {
    const activatedRoute = TestBed.get(ActivatedRoute);
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    activatedRoute.snapshot.params.groupId = '123';
    spyOn(groupsService, 'addMemberToGroup').and.returnValue(groupMemberMock.mockGroupList[0]);
    spyOn(component.memberCreation, 'emit');
    spyOn(toasterService, 'success').and.callThrough();
    component.userid = '1';
    component.VerifyMemberUserId();
    component.addUserToGroup().then(() => {
      expect(toasterService.success).toHaveBeenCalled();
      expect(component.memberCreation.emit).toHaveBeenCalledWith(groupMemberMock.mockGroupList[0]);
    });
  });


});
