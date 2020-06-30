import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersComponent } from './group-members.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';

describe('GroupMembersComponent', () => {
  let component: GroupMembersComponent;
  let fixture: ComponentFixture<GroupMembersComponent>;

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {},
      data: {
        telemetry: { env: 'group' }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupMembersComponent],
      imports: [SharedModule.forRoot(),
        CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true },
      { identifier: '2', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true, indexOfMember: 5, isCreator: false },
      { identifier: '6', initial: 'R', title: 'Robert Downey', isAdmin: true, isMenu: true, indexOfMember: 7, isCreator: false }];

    const expectedMemberList = members.map(item => { item.isMenu = false; return item; });
    console.log('expectedMemberList', expectedMemberList);
    component.members = members;
    component.showMenu = true;
    component.config.showMemberMenu = false;
    document.body.dispatchEvent(new Event('click'));
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.memberListToShow).toEqual(expectedMemberList);
  });

  it('should call getMenuData', () => {
    component.showMenu = false;
    const member = {
      identifier: '2', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true, indexOfMember: 5, isCreator: false
    };
    const clickEvent = {
      stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
    };
    component.getMenuData({ data: { name: 'delete' }, event: clickEvent }, member);
    expect(component.showMenu).toBe(true);
  });

  it('should call search', () => {
    component.showSearchResults = false;
    const members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
    ];
    component.members = members;
    component.memberListToShow = [];
    component.search('Joh');
    expect(component.showSearchResults).toBe(true);
  });

  it('should reset the list to membersList when no search key present', () => {
    component.showSearchResults = true;
    const members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
    ];
    component.members = members;
    component.search('');
    expect(component.showSearchResults).toBe(false);
  });

  it('should open the modal', () => {
    component.showModal = false;
    component.openModal('delete');
    expect(component.showModal).toBe(true);
    expect(component.memberAction).toEqual('delete');
  });

  it('should call addMember', () => {
    const router = TestBed.get(Router);
    component.addMember();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call onModalClose', () => {
    component.onModalClose();
  });

  it('should call onActionConfirm', () => {
    component.onActionConfirm();
  });
});
