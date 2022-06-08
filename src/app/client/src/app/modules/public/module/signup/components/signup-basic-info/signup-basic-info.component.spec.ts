import { ConfigService, ResourceService, UtilService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { SignupBasicInfoComponent } from './signup-basic-info.component';
import { FormBuilder } from '@angular/forms';

describe('SignupBasicInfoComponent', () => {
  let component: SignupBasicInfoComponent;

  const mockResourceService: Partial<ResourceService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockUtilService: Partial<UtilService> = {};
  const mockConfigService: Partial<ConfigService> = {};
  const mockFormBuilder: Partial<FormBuilder> = {};

  beforeAll(() => {
      component = new SignupBasicInfoComponent(
        mockResourceService as ResourceService, 
        mockTelemetryService as TelemetryService, 
        mockUtilService as UtilService, 
        mockConfigService as ConfigService, 
        mockFormBuilder as FormBuilder
      );
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should be create a instance', () => {
      expect(component).toBeTruthy();
  });

});
