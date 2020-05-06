import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingLocationSelectionComponent } from './onboarding-location-selection.component';

describe('OnboardingLocationSelectionComponent', () => {
  let component: OnboardingLocationSelectionComponent;
  let fixture: ComponentFixture<OnboardingLocationSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingLocationSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingLocationSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
