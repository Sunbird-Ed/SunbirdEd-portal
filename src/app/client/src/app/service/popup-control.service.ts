import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupControlService {

  private popupSource = new BehaviorSubject(true);
  public checkPopupStatus = this.popupSource.asObservable();
  private onboardPopupSubject = new BehaviorSubject<any>(null);
  constructor() { }

  changePopupStatus(value: boolean) {
    this.popupSource.next(value);
  }

  setOnboardingData(formData: any) {
    this.onboardPopupSubject.next(formData);
  }

  getOnboardingData() {
    return this.onboardPopupSubject.asObservable();
  }
}
