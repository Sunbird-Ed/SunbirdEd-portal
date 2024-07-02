import { LazzyLoadScriptService } from './lazzy-load-script.service';
import { ReplaySubject } from 'rxjs';

describe('LazzyLoadScriptService', () => {
  let service: LazzyLoadScriptService;
  let mockDocument: any;

  beforeEach(() => {
    mockDocument = {
      createElement: jest.fn(),
      body: {
        appendChild: jest.fn(),
      },
      getElementById: jest.fn(),
    };

    service = new LazzyLoadScriptService(mockDocument);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a script', () => {
    const url = 'https://example.com/script.js';
    const mockScript = { type: 'text/javascript', src: url, onload: null };
    const mockReplaySubject = new ReplaySubject<any>();
    mockDocument.createElement.mockReturnValue(mockScript);
    mockDocument.getElementById.mockReturnValue({ value: 'yes' });
    const observable = service.loadScript(url);
    observable.subscribe();
    expect(mockDocument.createElement).toHaveBeenCalledWith('script');
    expect(mockScript.onload).toBeTruthy();
    expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockScript);
    mockScript.onload();
    expect(service['_loadedLibraries'][url]).toBeTruthy();
    observable.subscribe((value) => {
      expect(value).toEqual(mockReplaySubject);
    });
  });

  it('should not set cdnUrl if cdnWorking is not "yes"', () => {
    const url = 'https://example.com/script.js';
    mockDocument.getElementById.mockReturnValue({ value: 'no' });
    service = new LazzyLoadScriptService(mockDocument);
    expect(service['cdnUrl']).toBe('');
  });

  it('should not set cdnUrl if cdnWorking is not "yes"', () => {
    const url = 'https://example.com/script.js';
    mockDocument.getElementById.mockReturnValue({ value: 'no' });
    service = new LazzyLoadScriptService(mockDocument);
    expect(service['cdnUrl']).toBe('');
  });

  it('should return an observable from _loadedLibraries if script is already loaded', () => {
    const url = 'https://example.com/script.js';
    const mockReplaySubject = new ReplaySubject<any>();
    service['_loadedLibraries'][url] = mockReplaySubject;
    const observable = service.loadScript(url);
    expect(observable).toEqual(mockReplaySubject.asObservable());
  });

});
