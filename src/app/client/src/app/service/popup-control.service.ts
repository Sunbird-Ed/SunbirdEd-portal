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
  
  /**
    * @description - This onboarding config data fetched from app component is set here as subject
  */
  setOnboardingData(formData: any) {
    this.onboardPopupSubject.next(formData);
  }
  
  /**
    * @description - This onboarding config data is returned to all observers
  */
  getOnboardingData() {
    return this.onboardPopupSubject.asObservable();
  }
}
