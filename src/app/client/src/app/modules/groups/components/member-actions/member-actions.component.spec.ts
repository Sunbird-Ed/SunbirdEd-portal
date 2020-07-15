import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberActionsComponent],
      imports: [SuiModule, SharedModule.forRoot(), HttpClientModule, TelemetryModule, RouterTestingModule],
      providers: [ TelemetryService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberActionsComponent);
    component = fixture.componentInstance;
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
});
