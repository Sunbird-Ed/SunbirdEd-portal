import { TelemetryService } from '@sunbird/telemetry';
import { TelemetryErrorModalComponent } from './telemetry-error-modal.component'

describe('Telemetry error module component', () => {
  let component: TelemetryErrorModalComponent;
  const mockTelemetryService: Partial<TelemetryService> = {
    impression: jest.fn()
  };

  beforeAll(() => {
    component = new TelemetryErrorModalComponent(
      mockTelemetryService as TelemetryService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should  create an instance of telemetry error modal component ", () => {
    expect(component).toBeTruthy();
    expect(component.showTelemetryEventsModal).toBeFalsy();
  });

  it('should create a instance of content type component', () => {
    component.ngOnInit();
    jest.spyOn(component, 'ngOnInit').mockImplementation(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
  it("component should be created and also the open modal will be called ", () => {
    component.openModal();
    jest.spyOn(component, 'openModal').mockImplementation(() => { });
    component.openModal();
    expect(component.showTelemetryEventsModal).toBeTruthy();
  });
  it("component should be created and also the close modal will be called ", () => {
    component.closeModal();
    jest.spyOn(component, 'closeModal').mockImplementation(() => { });
    component.closeModal();
    expect(component.showTelemetryEventsModal).toBeFalsy();
  });
})