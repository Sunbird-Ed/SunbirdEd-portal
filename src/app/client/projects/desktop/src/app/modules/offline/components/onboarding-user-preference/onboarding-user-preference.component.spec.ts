import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingUserPreferenceComponent } from './onboarding-user-preference.component';

xdescribe('OnboardingUserPreferenceComponent', () => {
  let component: OnboardingUserPreferenceComponent;
  let fixture: ComponentFixture<OnboardingUserPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingUserPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingUserPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
