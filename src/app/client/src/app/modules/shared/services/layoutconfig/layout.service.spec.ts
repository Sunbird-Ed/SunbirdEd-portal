import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayoutService = TestBed.get(LayoutService);
    expect(service).toBeTruthy();
  });
  it("should be called with",() => {
    const service: LayoutService = TestBed.get(LayoutService);
    service.setLayoutConfig({layout:"test"});
    expect(service.getLayoutConfig()).toBeTruthy();
    expect(service).toBeTruthy();
  })
});
