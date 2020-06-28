import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberActionsComponent } from './member-actions.component';

describe('MemberActionsComponent', () => {
  let component: MemberActionsComponent;
  let fixture: ComponentFixture<MemberActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberActionsComponent],
      imports: [SuiModule, SharedModule.forRoot(), HttpClientModule]
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
    component.member = { identifier: '123' };
    component.performAction();
    expect(component.actionConfirm.emit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
