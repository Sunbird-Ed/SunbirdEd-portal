import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingUserSelectionComponent } from './onboarding-user-selection.component';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('OnboardingUserSelectionComponent', () => {
  let component: OnboardingUserSelectionComponent;
  let fixture: ComponentFixture<OnboardingUserSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingUserSelectionComponent],
      imports: [
        TelemetryModule.forRoot(),
        SharedModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
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
