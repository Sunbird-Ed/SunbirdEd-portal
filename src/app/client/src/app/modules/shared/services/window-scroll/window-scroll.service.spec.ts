import { WindowScrollService } from './window-scroll.service';
describe('WindowScrollService', () => {
  let service: WindowScrollService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new WindowScrollService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  describe('currentYPosition', () => {
    it('should return pageYOffset when available', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      const result = service.currentYPosition();
      expect(result).toEqual(100);
    });

    it('should return document.documentElement.scrollTop when available', () => {
      Object.defineProperty(window, 'pageYOffset', { value: undefined, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 200, writable: true });
      const result = service.currentYPosition();
      expect(result).toEqual(200);
    });

    it('should return document.body.scrollTop when available', () => {
      Object.defineProperty(window, 'pageYOffset', { value: undefined, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: undefined, writable: true });
      Object.defineProperty(document.body, 'scrollTop', { value: 300, writable: true });
      const result = service.currentYPosition();
      expect(result).toEqual(300);
    });

    it('should return 0 when none of the properties are available', () => {
      Object.defineProperty(window, 'pageYOffset', { value: undefined, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: undefined, writable: true });
      Object.defineProperty(document.body, 'scrollTop', { value: undefined, writable: true });
      const result = service.currentYPosition();
      expect(result).toEqual(0);
    });
  });

  describe('elmYPosition', () => {
    it('should calculate element Y position with offsetParent', () => {
      const mockElement = document.createElement('div') as HTMLElement;
      const mockOffsetParent = document.createElement('div');
      mockOffsetParent.style.top = '50px';
      Object.defineProperty(mockElement, 'offsetTop', { value: 25, writable: false });
      Object.defineProperty(mockElement, 'offsetParent', { value: mockOffsetParent });
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
      const result = service.elmYPosition('mockElementId');
      expect(result).toBe(25);
    });

    it('should get current Y position', () => {
      global.pageYOffset = 100;
      const result = service.currentYPosition();
      expect(result).toBe(100);
      delete global.pageYOffset;
    });

    it('should get element Y position', () => {
      const mockElement = document.createElement('div');
      Object.defineProperty(mockElement, 'offsetTop', { value: 200, writable: false });
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
      const result = service.elmYPosition('mockElement');
      expect(result).toBe(200);
    });

  });

  describe('smoothScroll', () => {
    it('should handle the case when distance is less than 100', async () => {
      jest.spyOn(service, 'currentYPosition').mockReturnValue(0);
      jest.spyOn(service, 'elmYPosition').mockReturnValue(50);
      const scrollToMock = jest.fn();
      global.scrollTo = scrollToMock;
      service.smoothScroll('yourElementId');
      jest.runAllTimers();
      await Promise.resolve();
      expect(scrollToMock).toHaveBeenCalledWith(0, 50);
    });
  });

});
