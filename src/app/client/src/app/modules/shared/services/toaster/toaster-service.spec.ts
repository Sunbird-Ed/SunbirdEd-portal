import { ToasterService } from './toaster.service';

const mockIziToast = {
  success: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  show: jest.fn(),
  settings: jest.fn(),
};

beforeEach(() => {
  (global as any).iziToast = mockIziToast;
});

afterEach(() => {
  Object.keys(mockIziToast).forEach((key) => {
    mockIziToast[key].mockClear();
  });
});

describe('ToasterService', () => {
  let service: ToasterService;

  beforeEach(() => {
    service = new ToasterService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('success method should call iziToast.success', () => {
    const message = 'Success Message';
    service.success(message);
    expect(mockIziToast.success).toHaveBeenCalledWith({
      title: message,
      class: 'sb-toaster sb-toast-success',
    });
  });

  it('success method should call iziToast.success', () => {
    const message = 'Success Message';
    service.success(message);
    expect(mockIziToast.success).toHaveBeenCalledWith({
      title: message,
      class: 'sb-toaster sb-toast-success',
    });
  });

  it('info method should call iziToast.info', () => {
    const message = 'Info Message';
    service.info(message);
    expect(mockIziToast.info).toHaveBeenCalledWith({
      title: message,
      class: 'sb-toaster sb-toast-info',
    });
  });

  it('error method should call iziToast.error', () => {
    const message = 'Error Message';
    service.error(message);
    expect(mockIziToast.error).toHaveBeenCalledWith({
      title: message,
      class: 'sb-toaster sb-toast-error',
    });
  });

  it('warning method should call iziToast.warning', () => {
    const message = 'Warning Message';
    service.warning(message);
    expect(mockIziToast.warning).toHaveBeenCalledWith({
      title: message,
      class: 'sb-toaster sb-toast-warning',
    });
  });

  it('custom method should call iziToast.show', () => {
    const config = { class: 'custom-class', message: 'Custom Message' };
    service.custom(config);
    expect(mockIziToast.show).toHaveBeenCalledWith(config);
  });

  it('iziToast settings should be called in constructor', () => {
    expect(mockIziToast.settings).toHaveBeenCalledWith({
      position: 'topCenter',
      titleSize: '18',
    });
  });
});
