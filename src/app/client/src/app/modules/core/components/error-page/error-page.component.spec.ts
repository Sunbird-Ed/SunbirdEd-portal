import { ErrorPageComponent } from './error-page.component';

xdescribe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;

  beforeAll(() => {
    component = new ErrorPageComponent()
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create ErrorPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
