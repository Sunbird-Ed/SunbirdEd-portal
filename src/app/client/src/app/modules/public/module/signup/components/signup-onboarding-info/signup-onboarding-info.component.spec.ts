import { SignupOnboardingInfoComponent } from './signup-onboarding-info.component';
import { ResourceService, ToasterService } from '../../../../../shared';
describe('SignupOnboardingInfoComponent', () => {
  let component: SignupOnboardingInfoComponent;

  const mockResourceService: Partial<ResourceService> = {};
  const mockToasterService: Partial<ToasterService> = {};
  beforeAll(() => {
    component = new SignupOnboardingInfoComponent(
      mockResourceService as ResourceService,
      mockToasterService as ToasterService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
