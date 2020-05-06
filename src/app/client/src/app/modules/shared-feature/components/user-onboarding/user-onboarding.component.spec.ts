import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOnboardingComponent } from './user-onboarding.component';

describe('UserOnboardingComponent', () => {
  let component: UserOnboardingComponent;
  let fixture: ComponentFixture<UserOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
