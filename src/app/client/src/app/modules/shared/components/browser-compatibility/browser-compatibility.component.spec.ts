
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { DeviceDetectorService } from 'ngx-device-detector';

import { BrowserCompatibilityComponent } from './browser-compatibility.component';

xdescribe('BrowserCompatibilityComponent', () => {
  let component: BrowserCompatibilityComponent;
  let fixture: ComponentFixture<BrowserCompatibilityComponent>;
  const mockDeviceDetector = {
    browser: 'chrome'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [ BrowserCompatibilityComponent ],
      providers: [DeviceDetectorService],
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserCompatibilityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openCompatibilityModel method and  browser compatibility modal will show', () => {
    component.openCompatibilityModel();
    expect(component.browserCompatible).toBe(true);
  });
  it('should call openCompatibilityModel method and browser compatibility modal will not show', () => {
    component.openCompatibilityModel();
    expect(component.browserCompatible).not.toBe(false);
  });
  it('should call hideCompatibilityModel method and browser compatibility modal will close', () => {
    component.hideCompatibilityModel();
    expect(component.browserCompatible).toBe(false);
  });
  it('should call hideCompatibilityModel method and browser compatibility modal will not close', () => {
    component.hideCompatibilityModel();
    expect(component.browserCompatible).not.toBe(true);
  });

  it('should call showCompatibilityModal method and modal will not display if it is chrome browser', () => {
    const deviceDetectorService = TestBed.get(DeviceDetectorService);
    spyOn(deviceDetectorService, 'getDeviceInfo').and.returnValue(observableOf(mockDeviceDetector));
    component.ngOnInit();
    expect(component.deviceInfo).toBe('chrome');
  });

  it('should call showCompatibilityModal method and modal will display if the browser is other than chrome', () => {
      const mockDevice = {};
      const deviceDetectorService = TestBed.get(DeviceDetectorService);
      spyOn(deviceDetectorService, 'getDeviceInfo').and.returnValue(observableOf(mockDevice));
      component.ngOnInit();
      expect(component.deviceInfo).not.toBe('chrome');
    });

});
