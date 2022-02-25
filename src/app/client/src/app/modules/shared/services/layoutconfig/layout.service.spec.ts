import { TestBed } from '@angular/core/testing';

import { LayoutService, COLUMN_TYPE } from './layout.service';
import { ConfigService } from '../config/config.service';

describe('LayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ConfigService]
  }));

  it('should be created', () => {
    const service: LayoutService= <any> TestBed.inject(LayoutService);
    expect(service).toBeTruthy();
  });
  it('should be called with', () => {
    const service: LayoutService= <any> TestBed.inject(LayoutService);
    service.layoutConfig = null;
    service.initlayoutConfig();
    service.redoLayoutCSS(0, service.layoutConfig, COLUMN_TYPE.threeToNine, true);
    service.setLayoutConfig({layout: 'test'});
    service.redoLayoutCSS(0, service.layoutConfig, COLUMN_TYPE.fiveToSeven, true);
    service.redoLayoutCSS(0, service.layoutConfig, COLUMN_TYPE.fourToEight, true);
    service.redoLayoutCSS(0, service.layoutConfig, COLUMN_TYPE.threeToNine, true);
    service.redoLayoutCSS(0, service.layoutConfig, COLUMN_TYPE.twoToTen, true);
    service.initlayoutConfig();
    expect(service.getLayoutConfig()).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it('should switchLayout to new UI', () => {
    const service: LayoutService= <any> TestBed.inject(LayoutService);
    const configService= <any> TestBed.inject(ConfigService);
    service.layoutConfig = null;
    service.initiateSwitchLayout();
    expect(service.layoutConfig).toEqual(configService.appConfig.layoutConfiguration);
  });
  it('should switchLayout to accessibleLayout', () => {
    const service: LayoutService= <any> TestBed.inject(LayoutService);
    const configService= <any> TestBed.inject(ConfigService);
    service.layoutConfig = null;
    expect(service).toBeTruthy();
  });
  it('should switchLayout to accessibleLayout', () => {
    const service: LayoutService= <any> TestBed.inject(LayoutService);
    service.acessibleLayoutEnabled = true;
    const configService= <any> TestBed.inject(ConfigService);
    service.layoutConfig = null;
    expect(service).toBeTruthy();
  });

  it('should switchLayout to old UI', () => {
    const service: LayoutService= <any> TestBed.inject(LayoutService);
    const configService= <any> TestBed.inject(ConfigService);
    service.layoutConfig = configService.appConfig.layoutConfiguration;
    service.initiateSwitchLayout();
    expect(service.layoutConfig).toBe(null);
  });
});
