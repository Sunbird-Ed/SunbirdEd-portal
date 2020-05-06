import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingUserSelectionComponent } from './onboarding-user-selection.component';

describe('OnboardingUserSelectionComponent', () => {
  let component: OnboardingUserSelectionComponent;
  let fixture: ComponentFixture<OnboardingUserSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingUserSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingUserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
