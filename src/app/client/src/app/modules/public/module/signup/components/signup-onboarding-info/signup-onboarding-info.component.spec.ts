import { SignupOnboardingInfoComponent } from './signup-onboarding-info.component';

describe('SignupOnboardingInfoComponent', () => {
  let component: SignupOnboardingInfoComponent;

  beforeAll(() => {
    component = new SignupOnboardingInfoComponent();
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
