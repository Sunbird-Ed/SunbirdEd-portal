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

  it("should call onRegisterSubmit on submiting form", () => {
    jest.spyOn(component.subformInitialized, 'emit');
    jest.spyOn(component.triggerNext, 'emit');
    const onboardingData = { }
    component.onRegisterSubmit(onboardingData);
    expect(component.subformInitialized.emit).toHaveBeenCalled();
    expect(component.triggerNext.emit).toHaveBeenCalled();
  })
  
});
