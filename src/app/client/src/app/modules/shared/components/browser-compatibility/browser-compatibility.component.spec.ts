import { of as observableOf, Observable, of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CdnprefixPipe } from '../../pipes/cdnprefix.pipe';
import { BrowserCompatibilityComponent } from './browser-compatibility.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services';
import { CacheService } from 'ng2-cache-service';
import { Response } from './browser-compatibility.component.spec.data';

describe('BrowserCompatibilityComponent', () => {
  let component: BrowserCompatibilityComponent;
  let fixture: ComponentFixture<BrowserCompatibilityComponent>;
  const mockDeviceDetector = {
    browser: 'chrome'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, HttpClientTestingModule],
      declarations: [BrowserCompatibilityComponent, CdnprefixPipe],
      providers: [ResourceService, DeviceDetectorService, ConfigService, CacheService, BrowserCacheTtlService]
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
  /*it('should call openCompatibilityModel method and browser compatibility modal will not show', () => {
    //component.openCompatibilityModel();
    //expect(component.browserCompatible).not.toBe(false);
  });*/
  it('should call hideCompatibilityModel method and browser compatibility modal will close', () => {
    component.hideCompatibilityModel();
    expect(component.browserCompatible).toBe(false);
  });
  it('should call hideCompatibilityModel method and browser compatibility modal will not close', () => {
    component.hideCompatibilityModel();
    expect(component.browserCompatible).not.toBe(true);
  });

  it('should call modalHandler method and modal will be displayed if it is not chrome browser or firefox', () => {
    component.showModal = false;
    spyOn(component['_deviceDetectorService'], 'getDeviceInfo').and.returnValue(Response.deviceInfoIe);
    spyOn(component, 'modalHandler').and.callThrough();
    component.ngOnInit();
    expect(component.modalHandler).toHaveBeenCalled();
  });

  it('should call modalHandler method and modal will be displayed if it is firefox and being called from workspace', () => {
    component.showModal = true;
    spyOn(component['_deviceDetectorService'], 'getDeviceInfo').and.returnValue(Response.deviceInfoFirefox);
    spyOn(component, 'modalHandler').and.callThrough();
    component.ngOnInit();
    expect(component.modalHandler).toHaveBeenCalled();
  });
});

