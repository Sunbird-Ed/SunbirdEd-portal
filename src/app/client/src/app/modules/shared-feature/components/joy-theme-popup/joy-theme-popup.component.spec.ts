import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';

import {JoyThemePopupComponent} from './joy-theme-popup.component';
import {ResourceService, ConfigService, BrowserCacheTtlService, LayoutService, InterpolatePipe} from '@sunbird/shared';
import {configureTestSuite} from '@sunbird/test-util';

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
      imports: [SuiModule],
      declarations: [JoyThemePopupComponent, InterpolatePipe],
      providers: [LayoutService, {provide: ResourceService, useValue: resourceBundle}, ConfigService]
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
    component.isShown = true;
    spyOn(localStorage, 'setItem');
    spyOn(component.closeJoyThemePopup, 'emit');
    component.closePopup();
    expect(component.isShown).toBe(false);
    expect(component.closeJoyThemePopup.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('joyThemePopup', 'true');
  });

  it('should not switch to old layout as already in old ui', () => {
    component.isShown = true;
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'getLayoutConfig').and.returnValue(null);
    spyOn(layoutService, 'initiateSwitchLayout');
    spyOn(localStorage, 'setItem');
    spyOn(component.closeJoyThemePopup, 'emit');
    component.switchToOldLayout();
    expect(component.isShown).toBe(false);
    expect(component.closeJoyThemePopup.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('joyThemePopup', 'true');
    expect(layoutService.initiateSwitchLayout).not.toHaveBeenCalled();
  });

  it('should switch to old layout as already', () => {
    component.isShown = true;
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'getLayoutConfig').and.returnValue({layout: 'layout'});
    spyOn(layoutService, 'initiateSwitchLayout');
    spyOn(localStorage, 'setItem');
    spyOn(component.closeJoyThemePopup, 'emit');
    component.switchToOldLayout();
    expect(component.isShown).toBe(false);
    expect(component.closeJoyThemePopup.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('joyThemePopup', 'true');
    expect(layoutService.initiateSwitchLayout).toHaveBeenCalled();
  });
});
