import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupFormComponent } from './group-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash-es';
import { CoreModule, UserService} from '@sunbird/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { of as observableOf, of } from 'rxjs';
import { groupFormMockData } from './group-form.component.spec.data';
import { CacheService } from 'ng2-cache-service';
import { DebugElement } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { GroupsService } from '../../services';
import { APP_BASE_HREF } from '@angular/common';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let debugElement: DebugElement;

  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': ''}
    }
  };
  const fakeActivatedRoute = {
    'params': of({}),
    snapshot: {
      data: {
          telemetry: {
            env: 'groups', pageid: 'group-create', type: 'view', object: { type: 'groups', ver: '1.0' }
          }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      declarations: [GroupFormComponent],
      providers: [CacheService, { provide: ResourceService, useValue: resourceBundle }, { provide: Router }, UserService,
        TelemetryService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }, GroupsService,
        {provide: APP_BASE_HREF, useValue: '/'} ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should initialize form for onboarded user', () => {
    const userService = TestBed.get(UserService);
    const groupService = TestBed.get(GroupsService);
    userService._userData$.next({ err: null, userProfile: groupFormMockData.userMockData });
    component.userProfile = userService.userProfile;
    spyOn(groupService, 'isCustodianOrgUser').and.callFake(() => observableOf(false));
    spyOn(component, 'getFormOptionsForOnboardedUser').and.callThrough();
    spyOn(component, 'getFormatedFilterDetails').and.callThrough();
    spyOn(groupService, 'getFilteredFieldData').and.callFake(() => observableOf(groupFormMockData.categories1));
    component.ngOnInit();
    expect(component.groupForm.get('board').value).toEqual(component.userProfile.framework.board[0]);
    expect(component.groupForm.get('medium').value).toEqual(component.userProfile.framework.medium);
    expect(component.groupForm.get('gradeLevel').value).toEqual(component.userProfile.framework.gradeLevel);
    expect(component.groupForm.get('subject').value).toEqual(component.userProfile.framework.subject);
  });

  it('should initialize form for custodian user', () => {
    const userService = TestBed.get(UserService);
    const groupService = TestBed.get(GroupsService);
    const userMockData = _.omit(groupFormMockData.userMockData, 'framework');
    userService._userData$.next({ err: null, userProfile: userMockData });
    component.userProfile = userService.userProfile;
    spyOn(groupService, 'isCustodianOrgUser').and.callFake(() => observableOf(true));
    spyOn(groupService, 'getCustodianOrgData').and.callFake(() => observableOf(groupFormMockData.custOrgFrameworks1));
    spyOn(groupService, 'getFilteredFieldData').and.callFake(() => observableOf(groupFormMockData.categories1));
    spyOn(component, 'getFormOptionsForCustodianOrg').and.callThrough();
    spyOn(component, 'getFormatedFilterDetails').and.callThrough();
    component.ngOnInit();
    expect(component.groupForm.get('board').value).toEqual([]);
    expect(component.groupForm.get('medium').value).toEqual([]);
    expect(component.groupForm.get('gradeLevel').value).toEqual([]);
    expect(component.groupForm.get('subject').value).toEqual([]);
  });

  it('should empty child fields selection when parent fields are change', () => {
    const userService = TestBed.get(UserService);
    const groupService = TestBed.get(GroupsService);
    userService._userData$.next({ err: null, userProfile: groupFormMockData.userMockData });
    component.userProfile = userService.userProfile;
    spyOn(groupService, 'isCustodianOrgUser').and.callFake(() => observableOf(false));
    spyOn(component, 'getFormOptionsForOnboardedUser').and.callThrough();
    spyOn(component, 'getFormatedFilterDetails').and.callThrough();
    spyOn(groupService, 'getFilteredFieldData').and.callFake(() => observableOf(groupFormMockData.categories1));
    component.ngOnInit();
    component.groupForm.controls.board.setValue('NCERT');
    component.handleFieldChange('NCERT', 'board');
    expect(component.groupForm.get('board').value).toEqual('NCERT');
    expect(component.groupForm.get('medium').value).toEqual([]);
    expect(component.groupForm.get('gradeLevel').value).toEqual([]);
    expect(component.groupForm.get('subject').value).toEqual([]);
  });

  it('should fetch field options while changing board for custodian user', () => {
    const userService = TestBed.get(UserService);
    const groupService = TestBed.get(GroupsService);
    const userMockData = _.omit(groupFormMockData.userMockData, 'framework');
    userService._userData$.next({ err: null, userProfile: userMockData });
    component.userProfile = userService.userProfile;
    spyOn(groupService, 'isCustodianOrgUser').and.callFake(() => observableOf(true));
    spyOn(groupService, 'getCustodianOrgData').and.callFake(() => observableOf(groupFormMockData.custOrgFrameworks1));
    spyOn(groupService, 'getFilteredFieldData').and.callFake(() => observableOf(groupFormMockData.categories1));
    spyOn(component, 'getFormOptionsForCustodianOrg').and.callThrough();
    spyOn(component, 'getFormatedFilterDetails').and.callThrough();
    component.ngOnInit();
    component.groupForm.controls.board.setValue('sample');
    component.handleFieldChange('sample', 'board');
    expect(component.groupForm.get('board').value).toEqual('sample');
    expect(component.mediumList.length).toBeGreaterThan(0);
  });

  it('shoud show error if field is empty on submit', () => {
    const userService = TestBed.get(UserService);
    const groupService = TestBed.get(GroupsService);
    userService._userData$.next({ err: null, userProfile: groupFormMockData.userMockData });
    component.userProfile = userService.userProfile;
    spyOn(groupService, 'isCustodianOrgUser').and.callFake(() => observableOf(false));
    spyOn(component, 'getFormOptionsForOnboardedUser').and.callThrough();
    spyOn(component, 'getFormatedFilterDetails').and.callThrough();
    spyOn(groupService, 'getFilteredFieldData').and.callFake(() => observableOf(groupFormMockData.categories1));
    component.ngOnInit();
    component.onSubmitForm();
    expect(component.groupForm.get('groupName').invalid).toBeTruthy();
  });

  it('shoud submit form when form is valid', () => {
    const userService = TestBed.get(UserService);
    const groupService = TestBed.get(GroupsService);
    userService._userData$.next({ err: null, userProfile: groupFormMockData.userMockData });
    component.userProfile = userService.userProfile;
    spyOn(groupService, 'isCustodianOrgUser').and.callFake(() => observableOf(false));
    spyOn(component, 'getFormOptionsForOnboardedUser').and.callThrough();
    spyOn(component, 'getFormatedFilterDetails').and.callThrough();
    spyOn(groupService, 'getFilteredFieldData').and.callFake(() => observableOf(groupFormMockData.categories1));
    component.ngOnInit();
    component.groupForm.controls.groupName.setValue('G1');
    component.onSubmitForm();
    expect(component.groupForm.valid).toBeTruthy();
  });

});
