import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingComponent } from './onboarding.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      providers: [
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change slide value to contentPreference', () => {
    expect(component.slide).toEqual('location');
    component.handleLocationSaveEvent('SUCCESS');
    expect(component.slide).toEqual('contentPreference');
  });

  it('should not change slide value', () => {
    expect(component.slide).toEqual('location');
    component.handleLocationSaveEvent('ERROR');
    expect(component.slide).not.toEqual('contentPreference');
  });

  it('should emit onboard completion event', () => {
    spyOn(component.onboardingService.onboardCompletion, 'emit');
    component.handleContentPreferenceSaveEvent();
    expect(component.onboardingService.onboardCompletion.emit).toHaveBeenCalled();
  });

});
