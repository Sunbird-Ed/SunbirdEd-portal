import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingLocationSelectionComponent } from './onboarding-location-selection.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { userLocationMockData } from './onboarding-location-selection.component.spec.data';
import { UserService, DeviceRegisterService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { ProfileService } from '@sunbird/profile';
import { CommonModule } from '@angular/common';

describe('OnboardingLocationSelectionComponent', () => {
  let component: OnboardingLocationSelectionComponent;
  let fixture: ComponentFixture<OnboardingLocationSelectionComponent>;

  const resourceMockData = {
    messages: {
      emsg: { m0017: 'Fetching districts failed. Try again later', m0016: 'Fetching states failed. Try again later' }

    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingLocationSelectionComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SuiModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule
      ],
      providers: [
        UserService,
        DeviceRegisterService,
        NavigationHelperService,
        TelemetryService,
        PopupControlService,
        ProfileService,
        { provide: ResourceService, useValue: resourceMockData },
      ],
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

  it('should call set state and district is state and district when empty object', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({ state: {}, district: {} });
    expect(component.setState).toHaveBeenCalled();
    expect(component.setDistrict).toHaveBeenCalled();
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state and district is state and district when state empty', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({
      state: userLocationMockData.stateList[0],
      district: userLocationMockData.districtList[0]
    });
    expect(component.setState).toHaveBeenCalled();
    expect(component.setDistrict).toHaveBeenCalled();
    expect(component.onStateChange).toHaveBeenCalled();
  });
});
