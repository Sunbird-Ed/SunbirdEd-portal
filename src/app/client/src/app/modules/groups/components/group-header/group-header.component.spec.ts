import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupHeaderComponent } from './group-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MY_GROUPS, GROUP_DETAILS, CREATE_GROUP } from './../../interfaces';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import * as _ from 'lodash-es';

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  configureTestSuite();
  const fakeActivatedRoute = {};
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    messages: {
      smsg: {m002: ''},
      emsg: {m003: ''}
    },
    frmelmnts: {
      lbl: {
        createGroup: 'create group'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupHeaderComponent ],
      imports: [SuiModule, CommonConsumptionModule, SharedModule.forRoot(), HttpClientModule, RouterTestingModule],
      providers: [  { provide: ResourceService, useValue: resourceBundle},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: APP_BASE_HREF, useValue: '/'},
        { provide: Router, useClass: RouterStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeaderComponent);
    component = fixture.componentInstance;
    component.groupData = {id: '123', isAdmin: true, createdBy: 'user_123', name: 'Test group',
    members: [{createdBy: 'user_123', name: 'user123', role: 'admin'}]};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.creator).toEqual('You');
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
    spyOn(component['groupService'], 'deleteGroupById').and.returnValue(of (true));
    spyOn(component['toasterService'], 'success');
    component.deleteGroup();
    expect(component.toggleModal).toHaveBeenCalledWith(false);
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component['groupService'].deleteGroupById('123').subscribe(response => {
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m002);
      });
    });
  }));

  it ('should route to create-edit-group', () => {
    component.editGroup();
    expect(component['router'].navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`,
    _.get(component.groupData, 'id'), CREATE_GROUP]);
  });

  it ('show call goBack', () => {
    spyOn(component['navigationHelperService'], 'goBack');
    component.goBack();
    expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
  });

  it ('show change dropdownMenuContent', () => {
    component.dropdownContent = true;
    component.dropdownMenu();
    expect(component.dropdownContent).toBeFalsy();
  });

  it ('show change dropdownMenuContent', () => {
    component.showMemberPopup = false;
    component.toggleFtuModal(true);
    expect(component.showMemberPopup).toBeTruthy();
  });

});
