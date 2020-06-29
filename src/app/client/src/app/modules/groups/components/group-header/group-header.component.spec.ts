import { CREATE_EDIT_GROUP } from './../routerLinks';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupHeaderComponent } from './group-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MY_GROUPS } from '../routerLinks';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  configureTestSuite();
  const fakeActivatedRoute = {};
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    'messages': {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make showModal TRUE', () => {
    component.toggleModal(true);
    expect(component.showModal).toBeTruthy();
  });

  it('should make showModal FALSE', () => {
    component.toggleModal(false);
    expect(component.showModal).toBeFalsy();
  });

  it('should call toggle modal and deleteGroupById', () => {
    component.groupData = {identifier: '1234'};
    spyOn(component, 'toggleModal');
    spyOn(component['groupService'], 'deleteGroupById').and.returnValue(of (true));
    component.deleteGroup();
    expect(component.toggleModal).toHaveBeenCalledWith(false);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component['groupService'].deleteGroupById).toHaveBeenCalledWith('1234');
    });
  });

  it ('should route to create-edit-group', () => {
    component.editGroup();
    expect(component['router'].navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${CREATE_EDIT_GROUP}`]);
  });

  it ('show call goBack', () => {
    spyOn(component['navigationHelperService'], 'goBack');
    component.goBack();
    expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
  });
});

