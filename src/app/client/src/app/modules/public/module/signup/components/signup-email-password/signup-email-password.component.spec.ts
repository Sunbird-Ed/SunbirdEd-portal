import { SignupEmailPasswordComponent } from './signup-email-password.component';

describe('SignupEmailPasswordComponent', () => {
  let component: SignupEmailPasswordComponent;

  beforeAll(() => {
    component = new SignupEmailPasswordComponent();
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
