import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import {JoyThemePopupComponent} from './joy-theme-popup.component';
import {ResourceService, ConfigService, BrowserCacheTtlService, LayoutService, InterpolatePipe} from '@sunbird/shared';
import {configureTestSuite} from '@sunbird/test-util';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JoyThemePopupComponent', () => {
  let component: JoyThemePopupComponent;
  let fixture: ComponentFixture<JoyThemePopupComponent>;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        textbook: 'textbook'
      },
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, TelemetryModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [JoyThemePopupComponent, InterpolatePipe],
      providers: [LayoutService, {provide: ResourceService, useValue: resourceBundle}, ConfigService, TelemetryService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoyThemePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close popup', () => {
    spyOn(localStorage, 'setItem');
    spyOn(component.closeJoyThemePopup, 'emit');
    component.closePopup();
    expect(component.closeJoyThemePopup.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('joyThemePopup', 'true');
  });

  it('should not switch to old layout as already in old ui', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'getLayoutConfig').and.returnValue({layout: 'layout'});
    spyOn(layoutService, 'initiateSwitchLayout');
    spyOn(localStorage, 'setItem');
    spyOn(component.closeJoyThemePopup, 'emit');
    component.switchToNewLayout();
    expect(component.closeJoyThemePopup.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('joyThemePopup', 'true');
    expect(layoutService.initiateSwitchLayout).not.toHaveBeenCalled();
  });

  it('should switch to old layout as already', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'getLayoutConfig').and.returnValue(null);
    spyOn(layoutService, 'initiateSwitchLayout');
    spyOn(localStorage, 'setItem');
    spyOn(component.closeJoyThemePopup, 'emit');
    component.switchToNewLayout();
    expect(component.closeJoyThemePopup.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('joyThemePopup', 'true');
    expect(layoutService.initiateSwitchLayout).toHaveBeenCalled();
  });

  it('should set telemetry data on init', () => {
    component.ngOnInit();
    expect(component.joyThemeIntractEdata).toEqual({
      id: 'joy-theme', type: 'click', pageid: 'joy-themePopup'
    });
    expect(component.oldThemeIntractEdata).toEqual({
      id: 'classic-theme',
      type: 'click',
      pageid: 'joy-themePopup'
    });
  });
});
