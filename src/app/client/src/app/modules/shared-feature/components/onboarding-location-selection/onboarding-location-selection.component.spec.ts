import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingLocationSelectionComponent } from './onboarding-location-selection.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OnboardingLocationSelectionComponent', () => {
  let component: OnboardingLocationSelectionComponent;
  let fixture: ComponentFixture<OnboardingLocationSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingLocationSelectionComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SuiModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
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
