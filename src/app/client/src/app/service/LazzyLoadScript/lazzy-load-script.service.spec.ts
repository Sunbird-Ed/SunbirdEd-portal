import { TestBed } from '@angular/core/testing';

import { LazzyLoadScriptService } from './lazzy-load-script.service';

// NEW xdescribe
xdescribe('LazzyLoadScriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should fetch script and return observable that completes on script load', () => {
    const service: LazzyLoadScriptService = TestBed.inject(LazzyLoadScriptService);
    const mockScript = {type: '', src: '', onload: () => {}};
    spyOn(service['document'], 'createElement').and.returnValue(mockScript);
    spyOn(service['document']['body'], 'appendChild').and.returnValue({});
    const observable = service.loadScript('test.js');
    mockScript.onload();
    expect(service).toBeTruthy();
    observable.subscribe(() => {
      expect(service['_loadedLibraries']['test.js']).toBeDefined();
    });
  });
});
