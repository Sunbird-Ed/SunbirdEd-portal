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
      declarations: [ MemberActionsComponent ],
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
    spyOn(component.modalClosed, 'emit');
    spyOn(component.modal, 'close');
    component.closeModal();
    expect(component.modalClosed.emit).toHaveBeenCalled();
    expect(component.modal.close).toHaveBeenCalled();
  });

  it('should emit handleMember event', () => {
    spyOn(component.handleMember, 'emit');
    spyOn(component, 'closeModal');
    component.member = {identifier: '123'};
    component.removeMember('Dismiss');
    expect(component.handleMember.emit).toHaveBeenCalledWith({data: {identifier: '123', modalName: 'Dismiss'}});
    expect(component.closeModal).toHaveBeenCalled();
  });
});
