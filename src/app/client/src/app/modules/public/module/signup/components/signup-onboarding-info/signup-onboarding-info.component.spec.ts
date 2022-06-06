import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOnboardingInfoComponent } from './signup-onboarding-info.component';

describe('SignupOnboardingInfoComponent', () => {
  let component: SignupOnboardingInfoComponent;
  let fixture: ComponentFixture<SignupOnboardingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupOnboardingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupOnboardingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
