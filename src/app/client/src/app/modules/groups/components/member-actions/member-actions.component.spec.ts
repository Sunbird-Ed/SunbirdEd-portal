import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberActionsComponent } from './member-actions.component';

describe('MemberActionsComponent', () => {
  let component: MemberActionsComponent;
  let fixture: ComponentFixture<MemberActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberActionsComponent ]
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
});
