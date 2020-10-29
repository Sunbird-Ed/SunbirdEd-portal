import { TelemetryService } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupHeaderComponent } from './group-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MY_GROUPS, GROUP_DETAILS, CREATE_GROUP } from './../../interfaces';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { impressionObj, fakeActivatedRoute } from './../../services/groups/groups.service.spec.data';
import { GroupsService } from '../../services/groups/groups.service';

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  configureTestSuite();

  const resourceBundle = {
    messages: {
      smsg: { m002: '' },
      emsg: { m003: '' }
    },
    frmelmnts: {
      lbl: {
        createGroup: 'create group',
        you: 'You'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/my-groups';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupHeaderComponent],
      imports: [SuiModule, CommonConsumptionModule, SharedModule.forRoot(), HttpClientModule, RouterTestingModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: Router, useClass: RouterStub },
        TelemetryService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeaderComponent);
    component = fixture.componentInstance;
    component.groupData = {
      id: '123', isAdmin: true, createdBy: 'user_123', name: 'Test group',
      members: [{ userId: 'user_123', createdBy: 'user_123', name: 'user123', role: 'admin' }]
    };
    spyOn(component['groupService'], 'getImpressionObject').and.returnValue(impressionObj);
    spyOn(component['groupService'], 'addTelemetry');
    fixture.detectChanges();
  });

  it('should create', () => {
    component.groupData['isCreator'] = true;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.creator).toEqual('User123');
  });

  it('should set creator name', () => {
    component.groupData = {
      isAdmin: false,
      name: 'Test',
      createdBy: 'abcd-pqr-xyz',
      id: 'pop-wer',
      members: [{ userId: 'abcd-pqr-xyz', createdBy: 'abcd-pqr-xyz', name: 'Admin user' }]
    };
    component.ngOnInit();
    expect(component.creator).toEqual('Admin user');
  });

  it('should make showModal TRUE', () => {
    component.toggleModal(true);
    expect(component.showModal).toBeTruthy();
  });

  it('should make showModal FALSE', () => {
    component.toggleModal(false);
    expect(component.showModal).toBeFalsy();
  });

  it('should call toggle modal and deleteGroupById', fakeAsync(() => {
    spyOn(component, 'toggleModal');
    spyOn(component, 'navigateToPreviousPage');
    spyOn(component['groupService'], 'deleteGroupById').and.returnValue(of(true));
    spyOn(component['toasterService'], 'success');
    component.deleteGroup();
    expect(component.toggleModal).toHaveBeenCalledWith(false);
    tick(1500);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component['groupService'].deleteGroupById('123').subscribe(response => {
        expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m002);
        expect(component.navigateToPreviousPage).toHaveBeenCalled();
      });
    });
  }));

  it('should route to create-edit-group', () => {
    component.editGroup();
    expect(component['router'].navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`,
    _.get(component.groupData, 'id'), CREATE_GROUP]);
  });

  it('show call goBack', () => {
    spyOn(component['navigationHelperService'], 'goBack');
    component.goBack();
    expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
  });

  it('show change dropdownMenuContent', () => {
    component.dropdownContent = true;
    component.dropdownMenu();
    expect(component.dropdownContent).toBeFalsy();
  });

  it('show emit closeModal event dropdownMenuContent', () => {
    spyOn(component.handleFtuModal, 'emit');
    component.toggleFtuModal(true);
    expect(component.handleFtuModal.emit).toHaveBeenCalledWith(true);
  });

  it('should call addTelemetry', () => {
    component.addTelemetry('ftu-popup');
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith('ftu-popup', fakeActivatedRoute.snapshot, []);
  });

  it('should call leaveGroup on success', () => {
    const groupService = TestBed.get(GroupsService);
    const toastService = TestBed.get(ToasterService);
    groupService.isCurrentUserCreator = false;
    spyOn(toastService, 'success');
    spyOn(groupService, 'removeMembers').and.returnValue(of({}));
    spyOn(component, 'goBack');
    component.leaveGroup();
    expect(component.goBack).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalled();
  });

  it('should call leaveGroup on error', () => {
    const groupService = TestBed.get(GroupsService);
    const toastService = TestBed.get(ToasterService);
    groupService.isCurrentUserCreator = false;
    spyOn(toastService, 'error');
    spyOn(groupService, 'removeMembers').and.returnValue(throwError({}));
    component.leaveGroup();
    expect(toastService.error).toHaveBeenCalled();
  });
});
