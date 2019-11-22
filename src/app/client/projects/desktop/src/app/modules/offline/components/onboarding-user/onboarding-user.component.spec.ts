import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingUserComponent } from './onboarding-user.component';

describe('OnboardingUserComponent', () => {
  let component: OnboardingUserComponent;
  let fixture: ComponentFixture<OnboardingUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
