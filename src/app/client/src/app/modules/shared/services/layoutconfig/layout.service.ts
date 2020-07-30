import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

export const COLUMN_TYPE = {
  threeToNine: [3,9],
  twoToTen: [2,10],
  fourToEight: [4,8],
  fiveToSeven: [5,7],
  fullLayout: [12,12]
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
 

  constructor(private configService: ConfigService) { }

  layoutConfig:any;

  initlayoutConfig() {
    if(this.layoutConfig!=null) {
      return this.layoutConfig;
    } else {
      return this.configService.appConfig.layoutConfiguration;
    }
  }

  getLayoutConfig() {
    return this.layoutConfig;
  }
  setLayoutConfig(layoutConfig:any) {
    this.layoutConfig = layoutConfig;
    this._layout$.next({layout:layoutConfig});
  }
  switchableLayout() {
    return this._layoutConfigData$;
  }
  redoLayoutCSS(panelIndex,layoutConfigExternal,columnType) {
    let total = 12;
    let resultLayout= columnType[panelIndex];
    if(layoutConfigExternal) {
        return "sb-g-col-xs-"+total+" sb-g-col-md-"+resultLayout+" sb-g-col-lg-"+resultLayout;
    } else {
      return "sb-g-col-xs-"+total+" sb-g-col-md-"+total+" sb-g-col-lg-"+total;
      
    }
  }
  isLayoutAvailable(layoutConfigExternal) {
    if(layoutConfigExternal!=null) {
      return true;
    }
    return false;
  }
}
