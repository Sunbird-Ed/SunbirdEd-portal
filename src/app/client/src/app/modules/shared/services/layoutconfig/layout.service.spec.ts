import { TestBed } from '@angular/core/testing';

import { LayoutService, COLUMN_TYPE } from './layout.service';
import { ConfigService } from '../config/config.service';

describe('LayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ConfigService]
  }));

  it('should be created', () => {
    const service: LayoutService = TestBed.get(LayoutService);
    expect(service).toBeTruthy();
  });
  it("should be called with",() => {
    const service: LayoutService = TestBed.get(LayoutService);
    service.layoutConfig = null;
    service.initlayoutConfig();
    service.redoLayoutCSS(0,service.layoutConfig,COLUMN_TYPE.threeToNine);
    service.setLayoutConfig({layout:"test"});
    service.redoLayoutCSS(0,service.layoutConfig,COLUMN_TYPE.threeToNine);
    service.initlayoutConfig();
    expect(service.getLayoutConfig()).toBeTruthy();
    expect(service).toBeTruthy();
  })
});
