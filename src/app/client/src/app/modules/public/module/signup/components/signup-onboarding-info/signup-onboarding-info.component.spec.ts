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

  it('should close the profile popup on onLocationModalClose() called', () => {
    const event = {
      isSubmitted: false
    };
    component.showEditUserDetailsPopup = !component.showEditUserDetailsPopup;
    component.onLocationModalClose(event);
    expect(component.showFullScreenLoader).toBe(false);
  });

  it('should close the profile popup on onLocationModalClose() called when submission is true', () => {
    const event = {
      isSubmitted: true
    };
    component.showEditUserDetailsPopup = !component.showEditUserDetailsPopup;
    component.onLocationModalClose(event);
    expect(component.showFullScreenLoader).toBe(true);
  });
});
