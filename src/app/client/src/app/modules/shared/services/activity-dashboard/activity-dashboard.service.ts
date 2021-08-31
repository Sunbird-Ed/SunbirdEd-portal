import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityDashboardService {
 
  public _isActivityAdded = false;
 
  constructor() { }

  set isActivityAdded(isAdded) {
    this._isActivityAdded = isAdded;
  }

  get isActivityAdded() {
    return this._isActivityAdded;
  }
}
