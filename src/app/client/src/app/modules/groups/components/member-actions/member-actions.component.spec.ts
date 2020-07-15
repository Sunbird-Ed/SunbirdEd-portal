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
      providers: [ TelemetryService,
        {provide: APP_BASE_HREF, useValue: '/'},
        { provide: ResourceService, useValue: resourceBundle }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberActionsComponent);
    component = fixture.componentInstance;
    component.member = {identifier: '1', title: 'user', initial: 'u',
    isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true, userId: '1', role: 'admin', name: 'user'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event', () => {
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.modalClose, 'emit');
    component.closeModal();
    expect(component.modalClose.emit).toHaveBeenCalled();
    expect(component.modal.deny).toHaveBeenCalled();
  });

  it('should emit handleMember event', () => {
    spyOn(component.actionConfirm, 'emit');
    spyOn(component, 'closeModal');
    component.action = 'dismiss';
    component.member = {
      identifier: '2',
      initial: 'P',
      title: 'Paul Walker',
      isAdmin: false,
      isMenu: true,
      indexOfMember: 5,
      isCreator: false,
      userId: '2',
      role: 'member',
      name: 'Paul Walker'
    };
    component.performAction();
    expect(component.actionConfirm.emit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it ('should call addTelemtry (promote-admin)', () => {
    component.action = 'promoteAsAdmin';
    spyOn(component, 'addTelemetry');
    component.ngOnInit();
    expect(component.addTelemetry).toHaveBeenCalledWith('promote-admin');
  });

  it ('should call addTelemtry (remove-from-group)', () => {
    component.action = 'removeFromGroup';
    spyOn(component, 'addTelemetry');
    component.ngOnInit();
    expect(component.addTelemetry).toHaveBeenCalledWith('remove-from-group');
  });

  it ('should call addTelemtry (dismiss-admin)', () => {
    component.action = 'dismissAsAdmin';
    spyOn(component, 'addTelemetry');
    component.ngOnInit();
    expect(component.addTelemetry).toHaveBeenCalledWith('dismiss-admin');
  });

  it ('should call addTelemtry (leave-from-group)', () => {
    component.action = 'leaveFromGroup';
    spyOn(component, 'addTelemetry');
    component.ngOnInit();
    expect(component.addTelemetry).toHaveBeenCalledWith('leave-from-group');
  });

});
