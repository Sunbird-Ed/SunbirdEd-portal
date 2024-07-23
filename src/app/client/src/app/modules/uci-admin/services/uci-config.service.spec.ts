import { UciConfigService } from './uci-config.service';

describe('UciConfigService', () => {
  let service: UciConfigService;

  beforeEach(() => {
    // Mocking the DOM element and its value
    const mockInputElement = document.createElement('input');
    mockInputElement.id = 'isUciConfigured';
    document.body.appendChild(mockInputElement);

    // Setting the value to true
    mockInputElement.value = 'true';

    // Creating an instance of the service
    service = new UciConfigService();
  });

  afterEach(() => {
    // Cleaning up the DOM element after each test
    const mockInputElement = <HTMLInputElement>document.getElementById('isUciConfigured');
    if (mockInputElement) {
      mockInputElement.remove();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize isUciEnabled correctly', () => {
    expect(service.isUciAdminEnabled()).toBe(true);
  });

});
