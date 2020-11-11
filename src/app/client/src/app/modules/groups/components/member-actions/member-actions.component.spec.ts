import { GroupMemberRole, GroupEntityStatus } from '@project-sunbird/client-services/models/group';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MemberActionsComponent } from './member-actions.component';
import { configureTestSuite } from '@sunbird/test-util';

describe('MemberActionsComponent', () => {
  let component: MemberActionsComponent;
  let fixture: ComponentFixture<MemberActionsComponent>;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      btn: {
        makeAdmin: 'makeAdmin',
        removeMember: 'removeMember',
        dismissAdmin: 'dismissAdmin',
      },
      lbl: {
        leaveGroup: 'leaveGroup'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberActionsComponent],
      imports: [SuiModule, SharedModule.forRoot(), HttpClientModule, TelemetryModule, RouterTestingModule],
      providers: [TelemetryService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ResourceService, useValue: resourceBundle }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberActionsComponent);
    component = fixture.componentInstance;
    component.member = {
      identifier: '1', title: 'user', initial: 'u',
      isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true, userId: '1', name: 'user',
      role: GroupMemberRole.ADMIN, id: '1',
      groupId: '', status: GroupEntityStatus.ACTIVE
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event', () => {
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.memberActionData = {
      title: `Leave Group?`,
      description: 'asas',
      buttonText: 'Leave Group',
      theme: 'error',
      eid: 'leave-from-group'
    };
    spyOn(component.modalClose, 'emit');
    component.closeModal();
    expect(component.modalClose.emit).toHaveBeenCalled();
    expect(component.modal.deny).toHaveBeenCalled();
  });

  it('should emit handleMember event', () => {
    spyOn(component.actionConfirm, 'emit');
    component.action = 'dismiss';
    component.memberActionData = {
      title: `Remove member?`,
      description: 'Remove member',
      buttonText: 'Remove member',
      theme: 'error',
      eid: 'leave-from-group'
    };
    component.member = {
      identifier: '2',
      initial: 'P',
      title: 'Paul Walker',
      isAdmin: false,
      isMenu: true,
      indexOfMember: 5,
      isCreator: false,
      userId: '2',
      name: 'Paul Walker',
      role: GroupMemberRole.MEMBER, id: '1',
      groupId: '', status: GroupEntityStatus.ACTIVE
    };
    component.performAction();
    expect(component.actionConfirm.emit).toHaveBeenCalled();
  });

});
