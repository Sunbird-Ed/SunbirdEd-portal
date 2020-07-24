import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  /**
   * BehaviorSubject Containing Layout Config.
   */
  private _layout$ = new BehaviorSubject<any>(undefined);
  public _layoutConfigData$: Observable<any> = this._layout$.asObservable();

  constructor() { }

  layoutConfig:any;

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
}
