import { SignupBasicInfoComponent } from './signup-basic-info.component';

describe('SignupBasicInfoComponent', () => {
  let component: SignupBasicInfoComponent;

  beforeAll(() => {
      component = new SignupBasicInfoComponent();
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should be create a instance', () => {
      expect(component).toBeTruthy();
  });

});
