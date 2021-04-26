import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

export const COLUMN_TYPE = {
  threeToNine: [3, 9],
  twoToTen: [2, 10],
  fourToEight: [4, 8],
  fiveToSeven: [5, 7],
  fullLayout: [12, 12]
};

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  /**
   * BehaviorSubject Containing Layout Config.
   */
  private _layout$ = new BehaviorSubject<any>(undefined);
  public _layoutConfigData$: Observable<any> = this._layout$.asObservable();
  updateSelectedContentType = new EventEmitter<any>();

  constructor(private configService: ConfigService) { }

  layoutConfig: any;
  acessibleLayoutEnabled:boolean;

  initlayoutConfig() {
    if (this.layoutConfig != null) {
      return this.layoutConfig;
    } else {
      return this.configService.appConfig.layoutConfiguration;
    }
  }

  getLayoutConfig() {
    return this.layoutConfig;
  }
  setLayoutConfig(layoutConfig: any) {
    this.layoutConfig = layoutConfig;
    this.setAccessableThemeAttribute(layoutConfig ? 'accessible': '');
    this._layout$.next({layout: layoutConfig});
  }
  switchableLayout() {
    return this._layoutConfigData$;
  }
  redoLayoutCSS(panelIndex, layoutConfigExternal, columnType, isFilterLayout?) {
    if (isFilterLayout) {
      return this.redoLayoutFilterCSS(panelIndex, layoutConfigExternal, columnType);
    }
    const total = 12;
    const sixteenColumn = 16;
    const resultLayout = columnType[panelIndex];
    const xxxltotal = panelIndex === 0 ? 4 : 12;
    if (layoutConfigExternal) {
        return 'sb-g-col-xs-' + total + ' sb-g-col-md-' + resultLayout + ' sb-g-col-lg-' + resultLayout + ' sb-g-col-xxxl-' + xxxltotal;
    } else {
      if(columnType[0] != total) {
        return 'sb-g-col-xs-' + total + ' sb-g-col-md-' + resultLayout + ' sb-g-col-lg-' + resultLayout + ' sb-g-col-xxxl-' + xxxltotal;
      } else {
        return 'sb-g-col-xs-' + total + ' sb-g-col-md-' + total + ' sb-g-col-lg-' + total + ' sb-g-col-xxxl-' + sixteenColumn;
      }
      

    }
  }

  redoLayoutFilterCSS(panelIndex, layoutConfigExternal, columnType) {
    const total = 12;
    const sixteenColumn = 16;
    const resultLayout = columnType[panelIndex];
    const xxxltotal = panelIndex === 0 ? 4 : 12;
    if (layoutConfigExternal) {
        return 'sb-g-col-xs-' + total + ' sb-g-col-md-' + 0 + ' sb-g-col-lg-' + resultLayout + ' sb-g-col-xxxl-' + xxxltotal;
    } else {
      return 'sb-g-col-xs-' + total + ' sb-g-col-md-' + 12 + ' sb-g-col-lg-' + total + ' sb-g-col-xxxl-' + sixteenColumn;
    }
  }
  isLayoutAvailable(layoutConfigExternal) {
    if (layoutConfigExternal != null) {
      return true;
    }
    return false;
  }

  initiateSwitchLayout() {
    if (this.layoutConfig) {
      this.layoutConfig = null;
      document.documentElement.setAttribute('layout', '');
      this.acessibleLayoutEnabled=false;
      localStorage.setItem('layoutType', 'default');
      localStorage.setItem('accessable-theme', '');
    } else {
      this.layoutConfig = this.configService.appConfig.layoutConfiguration;
      document.documentElement.setAttribute('layout', 'joy');
      localStorage.setItem('layoutType', 'joy');
    }
    this.setLayoutConfig(this.layoutConfig);
  }
 switchToAccessibleLayout() {
   if (this.acessibleLayoutEnabled) {
    this.acessibleLayoutEnabled=false;
    this.setAccessableThemeAttribute('');
   } else {
    this.acessibleLayoutEnabled=true;
    this.setAccessableThemeAttribute('accessible');
   }
  }

  private setAccessableThemeAttribute(val: string){
    document.documentElement.setAttribute('accessable-theme', val);
    localStorage.setItem('accessable-theme', val);
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
